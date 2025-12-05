import { treeifyError } from "zod";
import prisma from "../config/prisma.js";

/**
 * Count total bookings
 * @returns {Promise<number>}
 */
export const count = () => {
  return prisma.booking.count();
};

/**
 * Get all bookings with filters and pagination
 * @param {Object} filters - Optional filters
 * @param {string} [filters.status] - Filter by status
 * @param {number} [filters.limit] - Max number of results
 * @param {number} [filters.offset] - Pagination offset
 * @returns {Promise<{ total: number, count: number, bookings: Array }>}
 */
export const findAll = async (filters = {}) => {
  const limit = parseInt(filters.limit) || 10;
  const offset = parseInt(filters.offset) || 0;

  const where = {};
  if (filters.status) {
    where.status = { equals: filters.status, mode: "insensitive" };
  }

  const [total, bookings] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { startTime: "desc" },
      include: {
        user: true,
        station: true,
      },
    }),
  ]);

  return { total, count: bookings.length, bookings };
};

/**
 * Get all games without pagination (for views)
 * @returns {Promise<Array>}
 */
export const findAllSimple = () => {
  return prisma.booking.findMany({
    orderBy: { startTime: 'asc' },
    include: {
      user: true,
      station: true,
    },
  });
};

/**
 * Get a booking by its ID
 * @param {number} id - Booking ID
 * @returns {Promise<Object>}
 * @throws {Error} If booking not found (status 404)
 */
export const findById = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
      station: true,
    },
  });

  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  return booking;
}

/**
 * Verify that a station is available
 * @param {number} stationId - Station ID
 * @param {Date} startTime - Desired start time
 * @param {Date} endTime - Desired end time
 * @returns {Promise<boolean>}
 */
export const isStationAvailable = async (stationId, startTime, endTime, excludeBookingId = null) => {
  const overlappingBookings = await prisma.booking.findMany({
    where: {
      stationId,
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } },
      ],
      ...(excludeBookingId && { NOT: { id: excludeBookingId } }),
    },
  });
  return overlappingBookings.length === 0;
};

/**
 * Create a new booking
 * @param {Object} data - Booking data
 * @returns {Promise<Object>} Created booking
 */
export const create = async (data) => {
  const available = await isStationAvailable(data.stationId, data.startTime, data.endTime);
  if (!available) {
    const error = new Error('Station non disponible pour ce créneau');
    error.status = 409;
    throw error;
  }
  return prisma.booking.create({ data });
};

/** 
 * Update a booking
 * @param {number} id - Booking ID
 * @param {Object} data - New data
 * @returns {Promise<Object>} Updated booking
 * @throws {Error} If booking not found (status 404)
 */
export const update = async (id, data) => {
  const booking = await findById(id);

  const available = await isStationAvailable(
    data.stationId ?? booking.stationId,
    data.startTime ?? booking.startTime,
    data.endTime ?? booking.endTime,
    id
  );

  if (!available) {
    const error = new Error('Station non disponible pour ce créneau');
    error.status = 409;
    throw error;
  }

  return prisma.booking.update({
    where: { id },
    data,
  });
};

/**
 * Delete a booking
 * @param {number} id - Booking ID
 * @returns {Promise<void>}
 * @throws {Error} If booking not found (status 404)
 */
export const remove = async (id) => {
  await findById(id);

  await prisma.booking.delete({ where: { id } });
};