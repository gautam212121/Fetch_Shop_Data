import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export function generateCSV(shops) {
  const data = shops.map((shop) => ({
    'Shop Name': shop.shopName,
    'Owner Name': shop.ownerName || '',
    Phone: shop.phone || '',
    Address: shop.address || '',
    District: shop.district,
    State: shop.state,
    Category: shop.category,
    Pincode: shop.pincode || '',
    'Online Delivery': shop.onlineStatus ? 'Yes' : 'No',
    'Date Added': shop.createdAt.toLocaleDateString(),
  }));

  return Papa.unparse(data);
}

export function generateExcel(shops) {
  const data = shops.map((shop) => ({
    'Shop Name': shop.shopName,
    'Owner Name': shop.ownerName || '',
    Phone: shop.phone || '',
    Address: shop.address || '',
    District: shop.district,
    State: shop.state,
    Category: shop.category,
    Pincode: shop.pincode || '',
    'Online Delivery': shop.onlineStatus ? 'Yes' : 'No',
    'Date Added': shop.createdAt.toLocaleDateString(),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Shops');

  // Set column widths
  ws['!cols'] = [
    { wch: 25 },
    { wch: 20 },
    { wch: 15 },
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 30 },
    { wch: 12 },
    { wch: 15 },
    { wch: 12 },
  ];

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

export function generateJSON(shops) {
  return JSON.stringify(shops, null, 2);
}

export function getFileName(format, state) {
  const date = new Date().toISOString().split('T')[0];
  const stateName = state.replace(/\s+/g, '_');

  switch (format) {
    case 'csv':
      return `${stateName}_Shops_${date}.csv`;
    case 'xlsx':
      return `${stateName}_Shops_${date}.xlsx`;
    case 'json':
      return `${stateName}_Shops_${date}.json`;
    default:
      return `Shops_${date}.csv`;
  }
}
