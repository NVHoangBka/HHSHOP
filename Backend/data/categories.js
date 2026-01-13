module.exports = {
  categories: [
    {
      name: {
        vi: "Chăm sóc gia đình",
        en: "Family Care",
        cz: "Péče o domácnost",
      },
      slug: {
        vi: "cham-soc-gia-dinh",
        en: "family-care",
        cz: "domaci-pece",
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
          slug: {
            vi: "nuoc-giat",
            en: "laundry-detergent",
            cz: "praci-prostredky",
          },
          value: "nuoc-giat",
          regular: true,
        },
        {
          name: {
            vi: "Dầu gội - sữa tắm",
            en: "Shampoo & Body Wash",
            cz: "Šampony a sprchové gely",
          },
          slug: {
            vi: "dau-goi-sua-tam",
            en: "shampoo-body-wash",
            cz: "sampony-sprchove-gely",
          },
          value: "dau-goi-sua-tam",
          regular: true,
        },
        {
          name: {
            vi: "Chất tẩy rửa",
            en: "Cleaning Agents",
            cz: "Čisticí prostředky",
          },
          slug: {
            vi: "chat-tay-rua",
            en: "cleaning-agents",
            cz: "cistici-prostredky",
          },
          value: "chat-tay-rua",
          regular: false,
        },
        {
          name: {
            vi: "Đồ gia dụng",
            en: "Household Items",
            cz: "Domácí potřeby",
          },
          slug: {
            vi: "do-gia-dung",
            en: "household-items",
            cz: "domaci-potreby",
          },
          value: "do-gia-dung",
          regular: false,
        },
        {
          name: {
            vi: "Sáp thơm",
            en: "Scented Wax / Air Freshener",
            cz: "Vonný vosk / Osvěžovač vzduchu",
          },
          slug: {
            vi: "sap-thom",
            en: "air-freshener",
            cz: "osvezovac-vzduchu",
          },
          value: "sap-thom",
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
      slug: {
        vi: "do-dung-me-be",
        en: "mom-baby-essentials",
        cz: "potreby-pro-matky-a-deti",
      },
      image:
        "https://bizweb.dktcdn.net/thumb/small/100/518/448/themes/953339/assets/coll_2.png?1733201190476",
      description: {
        vi: "Sản phẩm dành cho mẹ bầu và em bé",
        en: "Products for mothers and babies",
        cz: "Produkty pro těhotné a děti",
      },
      order: 2,
      isFeatured: true,
      homeOrder: 2,
      parent: null,
      children: [],
    },

    {
      name: {
        vi: "Thực phẩm tươi sống",
        en: "Fresh Food",
        cz: "Čerstvé potraviny",
      },
      slug: {
        vi: "thuc-pham-tuoi-song",
        en: "fresh-food",
        cz: "cerstve-potraviny",
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
          slug: { vi: "rau-cu", en: "vegetables", cz: "zelenina" },
          value: "rau-cu",
          regular: false,
        },
        {
          name: {
            vi: "Hoa quả",
            en: "Fruits",
            cz: "Ovoce",
          },
          slug: { vi: "hoa-qua", en: "fruits", cz: "ovoce" },
          value: "hoa-qua",
          regular: true,
        },
        {
          name: {
            vi: "Thịt các loại",
            en: "Meat & Poultry",
            cz: "Maso a drůbež",
          },
          slug: { vi: "thit", en: "meat-poultry", cz: "maso-drubez" },
          value: "thit",
          regular: false,
        },
        {
          name: {
            vi: "Thủy hải sản",
            en: "Seafood",
            cz: "Mořské plody",
          },
          slug: { vi: "thuy-hai-san", en: "seafood", cz: "morske-plody" },
          value: "thuy-hai-san",
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
      slug: {
        vi: "thuc-pham-kho",
        en: "dry-food-groceries",
        cz: "trvanlive-potraviny",
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
      slug: {
        vi: "do-dung-nha-bep",
        en: "kitchen-utensils",
        cz: "kuchynske-potreby",
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
      slug: {
        vi: "sua-cac-loai",
        en: "milk-dairy",
        cz: "mleko-mlecne-vyrobky",
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
      slug: {
        vi: "van-phong-pham",
        en: "stationery-office-supplies",
        cz: "papirnictvi",
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
          slug: { vi: "but-viet", en: "pens", cz: "pera" },
          value: "but-viet",
          regular: false,
        },
        {
          name: {
            vi: "Giấy và sổ tay",
            en: "Paper & Notebooks",
            cz: "Papír a sešity",
          },
          slug: {
            vi: "giay-so-tay",
            en: "paper-notebooks",
            cz: "papir-sešity",
          },
          value: "giay-so-tay",
          regular: false,
        },
        {
          name: {
            vi: "Dụng cụ vẽ",
            en: "Drawing & Art Supplies",
            cz: "Kreslicí a výtvarné potřeby",
          },
          slug: {
            vi: "dung-cu-ve",
            en: "drawing-supplies",
            cz: "kreslici-vytvarne-potreby",
          },
          value: "dung-cu-ve",
          regular: false,
        },
      ],
    },
  ],
};
