export type Product = {
  id: string;
  productName: string;
  brand: string;
  model: string;
  category: string;
  subCategory: string;
  description: string;
  features: string[];

  pricing: {
    price: number;
    currency: string;
    discount: number;
    inStock: boolean;
    stockQuantity: number;
  };

  specifications: {
    general: {
      productName: string;
      brandName: string;
      colors: string;
      material: string;
      weight: string;
      sizeMm: string;
      privateMold: string;
      certificate: string[];
    };

    technical: {
      bluetoothVersion: string;
      wirelessDelayTime: string;
      waterproofStandard: string;
      chipset: string;
      batteryCapacity: string;
      useTime: string;
      standbyTime: string;
    };
  };

  images: {
    url: string;
    fileId?: string;
  }[];

  tags: string[];
};
