const axios = require('axios');
const cheerio = require('cheerio');

async function getURL(url) {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function getInventory(url) {
  const items = [];
  const data = await getURL(url);
  const $ = cheerio.load(data);
  const stockStatus = $('.data-table script:contains(optionStockStatus[)');
  stockStatus.each((index, elem) => {
    let text = elem.firstChild.data;
    let str = text.substring(text.indexOf('['), text.indexOf(';'));
    let itemId = str.substring(str.indexOf('[') + 1, str.indexOf(']'));
    let inStock = str.substring(str.indexOf('=') + 2);
    let name = $('.data-table .product-purchase-wrapper-' + itemId).find('.item-name').text();
    items.push({ itemId, inStock, name });
  })
  return items;
}

module.exports = {
  getInventory
}