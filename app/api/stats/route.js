import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const totalShops = await prisma.shop.count();

    const shopsByState = await prisma.shop.groupBy({
      by: ['state'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const shopsByCategory = await prisma.shop.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const onlineShops = await prisma.shop.count({
      where: { onlineStatus: true },
    });

    const recentShops = await prisma.shop.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const topDistricts = await prisma.shop.groupBy({
      by: ['district'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    return NextResponse.json({
      totalShops,
      shopsByState: shopsByState.map((item) => ({
        state: item.state,
        count: item._count.id,
      })),
      shopsByCategory: shopsByCategory.map((item) => ({
        category: item.category,
        count: item._count.id,
      })),
      onlineShops,
      offlineShops: totalShops - onlineShops,
      recentShops,
      topDistricts: topDistricts.map((item) => ({
        district: item.district,
        count: item._count.id,
      })),
    });
  } catch (error) {
    console.error('GET /api/stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
