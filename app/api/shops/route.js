import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
// import { sendXMPPNotification } from '@/lib/xmpp'; // Disabled - optional feature
import { generateCSV, generateExcel, generateJSON, getFileName } from '@/lib/export';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state');
    const district = searchParams.get('district');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const format = searchParams.get('format');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // If export format is requested
    if (format) {
      const where = {};
      if (state) where.state = state;
      if (district) where.district = district;
      if (category) where.category = category;
      if (search) {
        where.OR = [
          { shopName: { contains: search } },
          { phone: { contains: search } },
          { address: { contains: search } },
        ];
      }

      const shops = await prisma.shop.findMany({ where, orderBy: { createdAt: 'desc' } });

      let content;
      let contentType;
      let fileName;

      if (format === 'csv') {
        content = generateCSV(shops);
        contentType = 'text/csv';
        fileName = getFileName('csv', state || 'All');
      } else if (format === 'xlsx') {
        content = generateExcel(shops);
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileName = getFileName('xlsx', state || 'All');
      } else {
        content = generateJSON(shops);
        contentType = 'application/json';
        fileName = getFileName('json', state || 'All');
      }

      const response = new NextResponse(content);
      response.headers.set('Content-Type', contentType);
      response.headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
      return response;
    }

    // Regular GET with pagination
    const where = {};
    if (state) where.state = state;
    if (district) where.district = district;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { shopName: { contains: search } },
        { phone: { contains: search } },
        { address: { contains: search } },
      ];
    }

    const skip = (page - 1) * limit;
    const [shops, total] = await Promise.all([
      prisma.shop.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.shop.count({ where }),
    ]);

    return NextResponse.json({
      data: shops,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/shops error:', error);
    return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.shopName || !body.district || !body.state || !body.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check for duplicates
    const existingShop = await prisma.shop.findFirst({
      where: {
        OR: [
          {
            phone: body.phone,
            district: body.district,
            state: body.state,
          },
          {
            shopName: body.shopName,
            district: body.district,
            state: body.state,
          },
        ],
      },
    });

    if (existingShop) {
      return NextResponse.json(
        {
          error: 'A shop with this name or phone already exists in this district',
          duplicate: true,
        },
        { status: 409 }
      );
    }

    const shop = await prisma.shop.create({
      data: {
        shopName: body.shopName,
        ownerName: body.ownerName,
        phone: body.phone,
        address: body.address,
        district: body.district,
        state: body.state,
        category: body.category,
        pincode: body.pincode,
        onlineStatus: body.onlineStatus || false,
      },
    });

    // Send XMPP notification (disabled - optional feature)
    // const message = `New shop added: ${shop.shopName} in ${shop.district}, ${shop.state} (${shop.category})`;
    // await sendXMPPNotification(message);

    return NextResponse.json(shop, { status: 201 });
  } catch (error) {
    console.error('POST /api/shops error:', error);
    return NextResponse.json({ error: 'Failed to create shop' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 });
    }

    const shop = await prisma.shop.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(shop);
  } catch (error) {
    console.error('DELETE /api/shops error:', error);
    return NextResponse.json({ error: 'Failed to delete shop' }, { status: 500 });
  }
}
