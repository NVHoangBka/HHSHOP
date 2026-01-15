module.exports = {
  categories: [
    {
      name: {
        vi: "Chăm sóc gia đình",
        en: "Family Care",
        cz: "Péče o domácnost",
      },
      image:
        "https://bizweb.dktcdn.net/thumb/small/100/518/448/themes/953339/assets/coll_1.png?1733201190476",
      description: {
        vi: "Sản phẩm chăm sóc nhà cửa, giặt giũ, vệ sinh, khử mùi",
        en: "Household cleaning, laundry, hygiene and air freshener products",
        cz: "Produkty na čištění domácnosti, praní, hygienu a osvěžovače vzduchu",
      },
      order: 1,
      isFeatured: true,
      homeOrder: 1,
      parent: null, // Cấp 1
      children: [
        {
          name: {
            vi: "Nước giặt",
            en: "Laundry Detergent",
            cz: "Prací prostředky",
          },
          regular: true,
        },
        {
          name: {
            vi: "Dầu gội - sữa tắm",
            en: "Shampoo & Body Wash",
            cz: "Šampony a sprchové gely",
          },
          regular: true,
        },
        {
          name: {
            vi: "Chất tẩy rửa",
            en: "Cleaning Agents",
            cz: "Čisticí prostředky",
          },
          regular: false,
        },
        {
          name: {
            vi: "Đồ gia dụng",
            en: "Household Items",
            cz: "Domácí potřeby",
          },
          regular: false,
        },
        {
          name: {
            vi: "Sáp thơm",
            en: "Scented Wax / Air Freshener",
            cz: "Vonný vosk / Osvěžovač vzduchu",
          },
          regular: false,
        },
      ],
    },

    {
      name: {
        vi: "Đồ dùng mẹ & bé",
        en: "Mom & Baby Essentials",
        cz: "Potřeby pro matky a děti",
      },
      image:
        "https://bizweb.dktcdn.net/thumb/small/100/518/448/themes/953339/assets/coll_2.png?1733201190476",
      description: {
        vi: "Sản phẩm dành cho mẹ bầu và em bé",
        en: "Products for mothers and babies",
        cz: "Produkty pro těhotné a děti",
      },
      order: 2,
      isFeatured: false,
      parent: null,
      children: [],
    },

    {
      name: {
        vi: "Thực phẩm tươi sống",
        en: "Fresh Food",
        cz: "Čerstvé potraviny",
      },
      image:
        "https://bizweb.dktcdn.net/thumb/small/100/518/448/themes/953339/assets/coll_3.png?1733201190476",
      description: {
        vi: "Rau củ, trái cây, thịt tươi, hải sản",
        en: "Vegetables, fruits, fresh meat and seafood",
        cz: "Zelenina, ovoce, čerstvé maso a mořské plody",
      },
      order: 3,
      isFeatured: true,
      homeOrder: 3,
      parent: null,
      children: [
        {
          name: {
            vi: "Rau củ",
            en: "Vegetables",
            cz: "Zelenina",
          },
          regular: false,
        },
        {
          name: {
            vi: "Hoa quả",
            en: "Fruits",
            cz: "Ovoce",
          },
          regular: true,
        },
        {
          name: {
            vi: "Thịt các loại",
            en: "Meat & Poultry",
            cz: "Maso a drůbež",
          },
          regular: false,
        },
        {
          name: {
            vi: "Thủy hải sản",
            en: "Seafood",
            cz: "Mořské plody",
          },
          regular: false,
        },
      ],
    },

    {
      name: {
        vi: "Thực phẩm khô",
        en: "Dry Food & Groceries",
        cz: "Trvanlivé potraviny",
      },
      image:
        "https://bizweb.dktcdn.net/thumb/small/100/518/448/themes/953339/assets/coll_4.png?1733201190476",
      description: {
        vi: "Thực phẩm đóng gói, đồ khô, gia vị",
        en: "Packaged dry goods, spices, canned food",
        cz: "Trvanlivé potraviny, koření, konzervy",
      },
      order: 4,
      isFeatured: false,
      parent: null,
      children: [],
    },

    {
      name: {
        vi: "Đồ dùng nhà bếp",
        en: "Kitchen Utensils & Appliances",
        cz: "Kuchyňské potřeby a spotřebiče",
      },
      image:
        "https://bizweb.dktcdn.net/thumb/small/100/518/448/themes/953339/assets/coll_5.png?1733201190476",
      description: {
        vi: "Dụng cụ, nồi niêu, thiết bị nhà bếp",
        en: "Kitchen tools, cookware, appliances",
        cz: "Kuchyňské náčiní, nádobí, spotřebiče",
      },
      order: 5,
      isFeatured: false,
      parent: null,
      children: [],
    },

    {
      name: {
        vi: "Sữa các loại",
        en: "Milk & Dairy Products",
        cz: "Mléko a mléčné výrobky",
      },
      image:
        "https://bizweb.dktcdn.net/thumb/small/100/518/448/themes/953339/assets/coll_6.png?1733201190476",
      description: {
        vi: "Sữa tươi, sữa chua, phô mai, bơ",
        en: "Milk, yogurt, cheese, butter",
        cz: "Mléko, jogurty, sýry, máslo",
      },
      order: 6,
      isFeatured: false,
      parent: null,
      children: [],
    },

    {
      name: {
        vi: "Văn phòng phẩm",
        en: "Stationery & Office Supplies",
        cz: "Papírnictví",
      },
      image:
        "https://bizweb.dktcdn.net/thumb/small/100/518/448/themes/953339/assets/coll_6.png?1733201190476",
      description: {
        vi: "Bút, sổ tay, giấy note, dụng cụ học tập",
        en: "Pens, notebooks, sticky notes, school supplies",
        cz: "Pera, sešity, samolepky, školní potřeby",
      },
      order: 7,
      isFeatured: true,
      homeOrder: 4,
      parent: null,
      children: [
        {
          name: {
            vi: "Bút viết",
            en: "Pens & Writing Instruments",
            cz: "Pera a psací potřeby",
          },
          regular: false,
        },
        {
          name: {
            vi: "Giấy và sổ tay",
            en: "Paper & Notebooks",
            cz: "Papír a sešity",
          },
          regular: false,
        },
        {
          name: {
            vi: "Dụng cụ vẽ",
            en: "Drawing & Art Supplies",
            cz: "Kreslicí a výtvarné potřeby",
          },
          regular: false,
        },
      ],
    },
    {
      name: {
        vi: "Sản phẩm được quan tâm",
        en: "Featured Products",
        cz: "Doporučené produkty",
      },
      image:
        "https://bizweb.dktcdn.net/thumb/small/100/518/448/themes/953339/assets/coll_6.png?1733201190476",
      description: {
        vi: "Các sản phẩm được khách hàng quan tâm và mua nhiều nhất",
        en: "Products that are most popular and highly favored by customers",
        cz: "Produkty, které jsou nejoblíbenější a nejvíce vyhledávané zákazníky",
      },
      order: 8,
      isFeatured: true,
      homeOrder: 2,
      parent: null,
      children: [],
    },
  ],
};
