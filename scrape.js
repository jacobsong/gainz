const axios = require('axios');
const cheerio = require('cheerio');

async function getInventory(url) {
  try {
    const config = {
      url: url,
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36" }
    }
    const items = [];
    const { data } = await axios.get(url, config);
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
  } catch (e) {
      console.log(e);
      console.log(`Axios error - ${e.message} ${e.response.statusText}`);
      return {
        isError: true,
        msg: `Axios error - ${e.message} ${e.response.statusText}`
      }
  }
}

module.exports = {
  getInventory
}