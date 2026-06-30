import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { pool } from '../common/db';

@Controller('/orders')
export class OrderController {
  @Post('/submit')
  async submitOrder(@Body() body: any, @Req() req: any) {
    const userId = req.headers['user-id'];

    if (!body.flightNo || !body.station || !body.items) {
      return {
        success: false,
        message: 'Invalid request',
      };
    }

    const existingOrder = await pool.query(
      `SELECT * FROM orders 
       WHERE flight_no = '${body.flightNo}' 
       AND station = '${body.station}' 
       AND flight_date = '${body.flightDate}'`
    );

    if (existingOrder.rows.length > 0) {
      return {
        success: false,
        message: 'Order already exists',
      };
    }

    const totalQuantity = body.items.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);

    const orderResult = await pool.query(
      `INSERT INTO orders 
       (flight_no, station, flight_date, status, total_quantity, created_by, created_at)
       VALUES 
       ('${body.flightNo}', '${body.station}', '${body.flightDate}', 'SUBMITTED', ${totalQuantity}, '${userId}', NOW())
       RETURNING id`
    );

    const orderId = orderResult.rows[0].id;

    for (const item of body.items) {
      await pool.query(
        `INSERT INTO order_items 
         (order_id, item_code, quantity, remarks)
         VALUES 
         (${orderId}, '${item.itemCode}', ${item.quantity}, '${item.remarks}')`
      );
    }

    await pool.query(
      `INSERT INTO audit_logs 
       (entity_type, entity_id, action, performed_by, created_at)
       VALUES 
       ('ORDER', ${orderId}, 'SUBMITTED', '${userId}', NOW())`
    );

    await pool.query(
      `UPDATE inventory 
       SET reserved_quantity = reserved_quantity + ${totalQuantity}
       WHERE station = '${body.station}'`
    );

    return {
      success: true,
      message: 'Order submitted successfully',
      orderId,
    };
  }

  @Post('/:id/approve')
  async approveOrder(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const approverId = req.headers['user-id'];

    const order = await pool.query(
      `SELECT * FROM orders WHERE id = ${id}`
    );

    if (order.rows.length === 0) {
      return {
        success: false,
        message: 'Order not found',
      };
    }

    if (order.rows[0].status === 'APPROVED') {
      return {
        success: true,
        message: 'Already approved',
      };
    }

    if (body.comment && body.comment.length > 500) {
      return {
        success: false,
        message: 'Comment too long',
      };
    }

    await pool.query(
      `UPDATE orders 
       SET status = 'APPROVED', approved_by = '${approverId}', approved_at = NOW()
       WHERE id = ${id}`
    );

    await pool.query(
      `INSERT INTO approval_history 
       (order_id, status, comment, approved_by, created_at)
       VALUES 
       (${id}, 'APPROVED', '${body.comment}', '${approverId}', NOW())`
    );

    await this.sendApprovalNotification(order.rows[0].flight_no, approverId);

    return {
      success: true,
      message: 'Order approved successfully',
    };
  }

  @Get('/search')
  async searchOrders(@Query() query: any) {
    let sql = `SELECT * FROM orders WHERE 1 = 1`;

    if (query.station) {
      sql += ` AND station = '${query.station}'`;
    }

    if (query.status) {
      sql += ` AND status = '${query.status}'`;
    }

    if (query.fromDate && query.toDate) {
      sql += ` AND flight_date BETWEEN '${query.fromDate}' AND '${query.toDate}'`;
    }

    sql += ` ORDER BY created_at DESC`;

    const result = await pool.query(sql);

    return {
      success: true,
      count: result.rows.length,
      data: result.rows,
    };
  }

  private async sendApprovalNotification(flightNo: string, approverId: string) {
    await fetch(process.env.NOTIFICATION_API_URL, {
      method: 'POST',
      body: JSON.stringify({
        flightNo,
        approverId,
        message: 'Order approved',
      }),
    });
  }
}
