import { generateSignatureCheckV2 } from './../utils/doku-utils/doku-utils';
import {
  DokuVariablesData,
  generateRequestId,
  getCurrentTimestamp,
} from './../utils/doku-utils/doku-config';
import { ResponseError } from '../error/response-error';
import prisma from '../prisma';
import { getCurrentTimeString } from '../utils/doku-utils/doku-config';
import {
  AddBokingProperty,
  AddDOKUPayment,
  CheckBokingPropertyReq,
  DOKUPaymentType,
  LineItem,
  LineItemCheckBookingRes,
  toAddBokingProperty,
  toGetBokingsProperty,
} from '../../models/transaction.model';
import axios from 'axios';
import { generateSignature } from '../utils/doku-utils/doku-utils';
import {
  AddDOKUPaymentRes,
  DOKUCheckRes,
  DOKURes,
  LineItemAddDOKUPaymentRes,
} from '../utils/doku-utils/doku-model';
import { countDaysInRange } from '../utils/date-utils';

export class TransactionService {
  static async addDOKUPayment(req: AddDOKUPayment) {
    const { userId, rooms: roomsOrd, checkIn, checkOut, pId } = req;
    const dateMargin = countDaysInRange(new Date(checkIn), new Date(checkOut));

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error('User does not exist.');

    const rooms = await prisma.room.findMany({
      where: {
        id: { in: roomsOrd.map((data) => data.roomId) },
      },
      include: {
        roomPrices: true,
        specialPrices: true,
      },
    });

    if (!rooms) throw new Error('Room does not exist.');

    const order = await prisma.order.findFirst({
      where: {
        userId,
        status: 'pending',
        expDateTime: {
          gt: new Date(),
        },
      },
    });

    if (order) throw new Error('Finish the previous Order');

    let amount = 0;
    const line_items: LineItemAddDOKUPaymentRes[] = [];

    rooms.forEach(({ id, type, roomPrices, specialPrices }) => {
      const quantity =
        roomsOrd.find((data) => data.roomId === id)?.quantity ?? 1;

      let roomPrice = 0;
      let originalPrice = roomPrices ? roomPrices.price : 0;
      let applicableSpecialPrice = null;

      // Check if there's a special price applicable for the date range
      applicableSpecialPrice = specialPrices.find(
        (sp) =>
          new Date(sp.fromDate) <= new Date(checkIn) &&
          (!sp.toDate || new Date(sp.toDate) >= new Date(checkOut)),
      );

      if (applicableSpecialPrice) {
        roomPrice = applicableSpecialPrice.price * dateMargin;
      } else if (roomPrices) {
        roomPrice = originalPrice * dateMargin;
      }

      amount += roomPrice * quantity;

      line_items.push({
        id: id,
        name: type,
        price: roomPrice, // Hanya harga sebelum dikalikan quantity, tapi sudah termasuk dateMargin
        quantity: quantity,
      });
    });

    const currentTimeString = getCurrentTimeString();

    const raw = JSON.stringify({
      order: {
        amount,
        invoice_number: `INV-${currentTimeString}`,
        currency: 'IDR',
        session_id: 'SU5WFDferd561dfasfasdfae123c',
        callback_url: `http://localhost:3000/property/${pId}`,
        line_items: line_items.map(({ name, price, quantity }) => {
          return {
            name,
            price,
            quantity,
          };
        }),
      },
      payment: {
        payment_due_date: 60,
      },
      customer: {
        name: user.name,
        email: user.email,
        phone: '+6285694566147',
        address: 'Plaza Asia Office Park Unit 3',
        country: 'ID',
      },
    });

    const requestId = generateRequestId();
    const requestTimestamp = getCurrentTimestamp();
    const signature = generateSignature(raw, requestId, requestTimestamp);

    const myHeaders = {
      'Client-Id': DokuVariablesData.Client_Id,
      'Request-Id': requestId,
      'Request-Timestamp': requestTimestamp,
      Signature: signature,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(
      'https://api-sandbox.doku.com/checkout/v1/payment',
      raw,
      { headers: myHeaders },
    );

    const res: DOKURes = response.data;
    return {
      ...res,
      response: {
        ...res.response,
        order: {
          ...res.response.order,
          line_items,
        },
      },
    } as AddDOKUPaymentRes;
  }

  static async checkBookingPayment(req: AddDOKUPayment) {
    const { userId, rooms: roomsOrd, checkIn, checkOut, pId } = req;
    const dateMargin = countDaysInRange(new Date(checkIn), new Date(checkOut));

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error('User does not exist.');

    const rooms = await prisma.room.findMany({
      where: {
        id: { in: roomsOrd.map((data) => data.roomId) },
      },
      include: {
        roomPrices: true,
        specialPrices: true,
        roomAvailabilities: true,
      },
    });

    if (!rooms) throw new Error('Room does not exist.');

    const order = await prisma.order.findFirst({
      where: {
        userId,
        status: 'pending',
        expDateTime: {
          gt: new Date(),
        },
      },
    });

    if (order) throw new Error('Finish the previous Order');

    let amount = 0;
    const line_items: LineItemCheckBookingRes[] = [];

    rooms.forEach(
      ({ id, type, roomPrices, specialPrices, roomAvailabilities }) => {
        const quantity =
          roomsOrd.find((data) => data.roomId === id)?.quantity ?? 1;

        let roomPrice = 0;
        let originalPrice = roomPrices ? roomPrices.price : 0;
        let applicableSpecialPrice = null;

        // Check if there's availability within the date range
        const isAvailable = roomAvailabilities.some(
          (availability) =>
            new Date(availability.fromDate) <= new Date(checkIn) &&
            new Date(availability.toDate) >= new Date(checkOut),
        );

        if (!isAvailable) {
          throw new Error(
            `Room with type ${type} is not available for the selected dates.`,
          );
        }

        // Check if there's a special price applicable for the date range
        applicableSpecialPrice = specialPrices.find(
          (sp) =>
            new Date(sp.fromDate) <= new Date(checkIn) &&
            (!sp.toDate || new Date(sp.toDate) >= new Date(checkOut)),
        );

        if (applicableSpecialPrice) {
          roomPrice = applicableSpecialPrice.price * dateMargin * quantity;
        } else if (roomPrices) {
          roomPrice = originalPrice * dateMargin * quantity;
        }

        amount += roomPrice;

        line_items.push({
          id: id,
          name: type,
          price: roomPrice,
          originalPrice: originalPrice,
          specialPrice: applicableSpecialPrice
            ? applicableSpecialPrice.price
            : null,
          quantity: quantity,
        });
      },
    );

    return {
      totalAmount: amount,
      line_items,
    };
  }

  static checkDOKUPayment = async (req: CheckBokingPropertyReq) => {
    const { invoiceId: invoiceNumber, userId } = req;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error('User does not exist.');

    const order = await prisma.order.findFirst({
      where: { invoiceId: invoiceNumber },
    });

    if (!order) throw new Error('Order does not exist.');

    const requestId = generateRequestId();
    const requestTimestamp = getCurrentTimestamp();
    const signature = generateSignatureCheckV2(
      invoiceNumber,
      requestId,
      requestTimestamp,
    );

    const myHeaders = {
      'Client-Id': DokuVariablesData.Client_Id,
      'Request-Id': requestId,
      'Request-Timestamp': requestTimestamp,
      Signature: signature,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.get(
        `https://api-sandbox.doku.com/orders/v1/status/${invoiceNumber}`,
        { headers: myHeaders },
      );

      if (response.status !== 200) throw new Error('Order does not exist.');

      const res: DOKUCheckRes = response.data;

      return res;
    } catch (error) {
      return;
    }
  };

  static async addBookingProperty(
    req: AddBokingProperty & {
      invoiceId: string;
      expDateTime: Date;
      urlPayment: string;
      totalPayment: number;
    },
  ) {
    const {
      userId,
      pId,
      rooms,
      checkIn,
      checkOut,
      urlPayment,
      totalPayment,
      expDateTime,
      invoiceId,
    } = req;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new ResponseError(404, 'User does not exist.');

    const property = await prisma.property.findUnique({
      where: { id: pId },
      include: { propertyCategory: true },
    });

    if (!property) throw new ResponseError(404, 'Property does not exist.');

    const order = await prisma.order.create({
      data: {
        userId,
        checkIn,
        checkOut,
        urlPayment,
        totalPayment,
        expDateTime,
        invoiceId,
        orderRooms: {
          createMany: {
            data: [
              ...rooms.map(({ roomId, quantity, price }) => ({
                roomId,
                quantity,
                price,
              })),
            ],
          },
        },
      },
      include: {
        orderRooms: {
          include: { room: true },
        },
      },
    });

    return toAddBokingProperty({
      ...order,
      orderProperty: {
        ...property,
        category: property.propertyCategory.name,
      },
      orderRooms: order.orderRooms.map(
        ({ id, room: { image, description, type }, quantity, price }) => ({
          id,
          image,
          description,
          type,
          quantity,
          price,
        }),
      ),
    });
  }

  static async updateBookingProperty(req: CheckBokingPropertyReq) {
    const { userId, invoiceId } = req;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new ResponseError(404, 'User does not exist.');

    const order = await prisma.order.findFirst({
      where: {
        userId,
        invoiceId,
      },
      include: {
        orderRooms: {
          include: {
            room: {
              include: {
                property: {
                  include: {
                    propertyCategory: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw new Error('order does not exist.');

    const property = order.orderRooms[0].room.property;
    const id = order.id;

    if (!property) throw new ResponseError(404, 'Property does not exist.');

    const updateorder = await prisma.order.update({
      where: {
        id,
        userId,
        invoiceId,
      },
      data: {
        status: 'confirming',
      },
      include: {
        orderRooms: {
          include: { room: true },
        },
      },
    });

    return toAddBokingProperty({
      ...updateorder,
      orderProperty: {
        ...property,
        category: property.propertyCategory.name,
      },
      orderRooms: updateorder.orderRooms.map(
        ({ id, room: { image, description, type }, quantity, price }) => ({
          id,
          image,
          description,
          type,
          quantity,
          price,
        }),
      ),
    });
  }

  static async getBookingProperty(req: CheckBokingPropertyReq) {
    const { userId, invoiceId } = req;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new ResponseError(404, 'User does not exist.');

    const order = await prisma.order.findFirst({
      where: {
        userId,
        invoiceId,
      },
      include: {
        orderRooms: {
          include: {
            room: {
              include: {
                property: {
                  include: {
                    propertyCategory: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw new Error('order does not exist.');

    const property = order.orderRooms[0].room.property;

    if (!property) throw new ResponseError(404, 'Property does not exist.');

    return toAddBokingProperty({
      ...order,
      orderProperty: {
        ...property,
        category: property.propertyCategory.name,
      },
      orderRooms: order.orderRooms.map(
        ({ id, room: { image, description, type }, quantity, price }) => ({
          id,
          image,
          description,
          type,
          quantity,
          price,
        }),
      ),
    });
  }

  static async cancelBookingProperty(req: CheckBokingPropertyReq) {
    const { userId, invoiceId } = req;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new ResponseError(404, 'User does not exist.');

    const order = await prisma.order.findFirst({
      where: {
        userId,
        invoiceId,
        status: 'pending',
      },
      include: {
        orderRooms: {
          include: {
            room: {
              include: {
                property: {
                  include: {
                    propertyCategory: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw new Error('Order does not exist or paid');

    const property = order.orderRooms[0].room.property;
    const id = order.id;

    if (!property) throw new ResponseError(404, 'Property does not exist.');

    const updateorder = await prisma.order.update({
      where: {
        id,
        userId,
        invoiceId,
      },
      data: {
        status: 'cancelled',
      },
      include: {
        orderRooms: {
          include: { room: true },
        },
      },
    });

    return toAddBokingProperty({
      ...updateorder,
      orderProperty: {
        ...property,
        category: property.propertyCategory.name,
      },
      orderRooms: updateorder.orderRooms.map(
        ({ id, room: { image, description, type }, quantity, price }) => ({
          id,
          image,
          description,
          type,
          quantity,
          price,
        }),
      ),
    });
  }

  static async getBookingsProperty(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) throw new Error('User does not exist.');

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        orderRooms: {
          include: {
            room: {
              include: {
                property: {
                  include: {
                    propertyCategory: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (orders.length < 1) return toGetBokingsProperty([]);

    return toGetBokingsProperty([
      ...orders.map((order) => {
        return {
          ...order,
          orderProperty: {
            ...order.orderRooms[0].room.property,
            category: order.orderRooms[0].room.property.name,
          },
          orderRooms: order.orderRooms.map(
            ({ id, room: { image, description, type }, quantity, price }) => ({
              id,
              image,
              description,
              type,
              quantity,
              price,
            }),
          ),
        };
      }),
    ]);
  }
}
