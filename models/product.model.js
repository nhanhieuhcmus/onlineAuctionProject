const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
  all: () => db.load('select * from product and end_date-NOW() > 0'),
  countByCat: async catName => {
    const rows = await db.load(`select count(*) as total from product,category where product.categoryid = category.id and category.name_category=\"${catName}\" and product.end_date-NOW() > 0`)
    return rows[0].total;
  },
  pageByCat: (catName, offset) => db.load(`select product.*, user.full_name from product,category,user where product.categoryid = category.id and category.name_category=\"${catName}\" and product.priceholder = user.id and product.end_date-NOW() > 0 limit ${config.paginate.limit} offset ${offset}`),
  allByCat: catName => db.load(`select product.*, user.full_name from product,category,user where name_category=\"${catName}\" and category.id = product.categoryid 
    and user.id = product.priceholder and product.end_date-NOW() > 0`),
  sameCategory: catName => db.load(`select product.*, user.full_name, category.name_category from product,category,user where name_category=\"${catName}\" and category.id = product.categoryid and product.end_date-NOW() > 0
  and user.id = product.priceholder limit 5`),
  single: id => db.load(`select * from product where id = ${id}`),
  add: entity => db.add('product', entity),
  del: id => db.del('product', { product_id: id }),
  patch: entity => {
    const condition = { id: entity.id };
    delete entity.product_id;
    return db.patch('product', entity, condition);
  },
  maxId: async () => {
    const res = await db.load('select max(id) as MaxID from product');
    return res[0].MaxID;
  },
  countForSearch: async key => {
    const rows = await db.load(`select count(*) as total
    from product left join category on product.categoryid=category.id
    where product.end_date-NOW() > 0 and match(product.name) against(\"${key}\") OR match(category.name_category) against(\"${key}\")`)
    return rows[0].total;
  },

  sortSearchResult: async (key, offset, condition, column, type) => await db.load(`select result.*, user.full_name
    from (select product.*,name_category
    from product left join category on product.categoryid=category.id
    where ${condition} and match(product.name) against(\"${key}\") OR match(category.name_category) against(\"${key}\")) as result LEFT JOIN user on result.priceholder = user.id 
    where result.end_date-NOW() > 0
    order by ${column} ${type}
    limit ${config.paginate.limit} offset ${offset}`),

  nearFinish: _ => db.load(`select product.*, user.full_name, category.name_category from product,category,user where product.categoryid = category.id and product.priceholder = user.id and end_date-NOW() > 0
                            order by end_date-NOW() asc limit 5`),

  mostExpensive: _ => db.load(`select product.*, user.full_name, category.name_category from product,category,user where product.categoryid = category.id and product.priceholder = user.id and end_date-NOW() > 0 order by current_price desc limit 5`),

  mostAuctionTimes: _ => db.load(`select product.*, user.full_name, category.name_category from product,category,user where product.categoryid = category.id and product.priceholder = user.id and end_date-NOW() > 0 order by auction_times desc limit 5`),

  favoriteByUser: userid => db.load(`select product.*, category.name_category, user.full_name
  from (select * from add_watch_list where user_id = ${userid}) as favorite, product, category, user
  where product.end_date - NOW() > 0 and favorite.product_id = product.id and product.categoryid = category.id and product.priceholder = user.id`),

};  