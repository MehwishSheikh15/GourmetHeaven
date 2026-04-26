/**
 * Sanity Schema Definitions for Gourmet Haven
 * Deploy these to your Sanity project as 'schema.ts' or separate files.
 */

/*
export const menuItem = {
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'category', title: 'Category', type: 'string', options: { list: ['Starters', 'Main Course', 'Deserts', 'Beverages', 'Deals'] } },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'price', title: 'Price (PKR)', type: 'number' },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'isAvailable', title: 'Is Available', type: 'boolean', initialValue: true },
    { name: 'isSpecial', title: 'Chef Special', type: 'boolean', initialValue: false },
  ]
}

export const deal = {
  name: 'deal',
  title: 'Deal',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'image', title: 'Image', type: 'image' },
    { name: 'discount', title: 'Discount Text (e.g. 20% OFF)', type: 'string' },
    { name: 'validUntil', title: 'Valid Until', type: 'datetime' },
    { name: 'isActive', title: 'Is Active', type: 'boolean', initialValue: true },
  ]
}

export const order = {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    { name: 'customerName', title: 'Customer Name', type: 'string' },
    { name: 'customerEmail', title: 'Customer Email', type: 'string' },
    { name: 'items', title: 'Items', type: 'array', of: [{ type: 'object', fields: [{ name: 'name', type: 'string' }, { name: 'price', type: 'number' }] }] },
    { name: 'totalAmount', title: 'Total Amount', type: 'number' },
    { name: 'status', title: 'Status', type: 'string', options: { list: ['Pending', 'Confirmed', 'Preparing', 'Delivered'] } },
    { name: 'paymentStatus', title: 'Payment Status', type: 'string', options: { list: ['Unpaid', 'Paid'] } },
    { name: 'clerkUserId', title: 'Clerk User ID', type: 'string' },
  ]
}
*/
