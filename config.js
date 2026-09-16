/* Utopia Laundromat — live store config: prices + product visibility.
   DEFAULTS below are the source of truth. Edits made in admin.html are
   stored in localStorage (key "utopia_cfg_v1") on that browser, and can be
   exported from admin.html as a new copy of THIS file for publishing.
   home.html + detail.html read everything through window.UTOPIA_CFG,
   so a price change or 上架/下架 applies everywhere at once. */
window.UTOPIA_DEFAULTS = {
  prices: {
    "wash.small": 3.00, "wash.medium": 6.00, "wash.large": 8.25, "dryer": 0.25,
    "drop.lb": 1.10, "drop.min": 12.00,
    "bed.blanket": 16, "bed.s": 16, "bed.m": 18, "bed.l": 20, "bed.down": 22,
    "dry.from": 4.50,
    "shop.p01": 1, "shop.p02": 5, "shop.p03": 6, "shop.p04": 7.5,
    "shop.p05": 6, "shop.p06": 4, "shop.p07": 4.5, "shop.p08": 2.25,
    "shop.p09": 2, "shop.p10": 1, "shop.p11": 2, "shop.p12": 2,
    "shop.p13": 6, "shop.p14": 4.5, "shop.p15": 2.25, "shop.p16": 2,
    "shop.p17": 6
  },
  products: [
    {id:"p01",cat:"stain"},{id:"p02",cat:"det"},{id:"p03",cat:"det"},{id:"p04",cat:"det"},
    {id:"p05",cat:"soft"},{id:"p06",cat:"soft"},{id:"p07",cat:"soft"},{id:"p08",cat:"soft"},
    {id:"p09",cat:"det"},{id:"p10",cat:"pods"},{id:"p11",cat:"sheet"},{id:"p12",cat:"sheet"},
    {id:"p13",cat:"det"},{id:"p14",cat:"bleach"},{id:"p15",cat:"bleach"},{id:"p16",cat:"det"},
    {id:"p17",cat:"bag"}
  ]
};
(function(){
  var KEY = "utopia_cfg_v1", D = window.UTOPIA_DEFAULTS;
  function num(v, fb){ v = parseFloat(v); return (isFinite(v) && v >= 0 && v <= 99999) ? Math.round(v*100)/100 : fb; }
  function load(){
    try{ var o = JSON.parse(localStorage.getItem(KEY) || "{}"); return (o && typeof o === "object") ? o : {}; }
    catch(e){ return {}; }
  }
  var over = load(), prices = {}, k;
  for(k in D.prices){ prices[k] = num(over.prices && over.prices[k], D.prices[k]); }
  var products = D.products.map(function(p){
    var o = (over.products && over.products[p.id]) || {};
    var vis = (o.visible !== undefined) ? o.visible !== false : p.visible !== false;
    return {id:p.id, cat:p.cat, price:num(o.price, D.prices["shop."+p.id]), visible:vis};
  });
  function money(n){ return "$"+(+n).toFixed(2); }
  window.UTOPIA_CFG = {
    prices: prices,
    products: products,
    money: money,
    wmin: function(){
      var r = +(prices["drop.lb"] || 1.1); if(!(r > 0)) r = 1.1;
      return Math.max(1, Math.floor((+prices["drop.min"] || 12) / r));
    },
    getPrice: function(path){
      if(prices[path] !== undefined) return prices[path];
      var m = /^shop\.(p\d\d)$/.exec(path || "");
      if(m){ var p = this.getProduct(m[1]); return p ? p.price : null; }
      return null;
    },
    getProduct: function(id){
      for(var i=0;i<products.length;i++) if(products[i].id===id) return products[i];
      return null;
    }
  };
})();
