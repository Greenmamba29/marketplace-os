import axios from 'axios';

const SALEOR_API_URL = import.meta.env.VITE_SALEOR_API_URL || 'https://cheemos.saleor.cloud/graphql/';
const SALEOR_TOKEN = import.meta.env.VITE_SALEOR_TOKEN;

// GraphQL client for Saleor
const saleorClient = axios.create({
  baseURL: SALEOR_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': SALEOR_TOKEN ? `Bearer ${SALEOR_TOKEN}` : undefined,
  },
});

// GraphQL query helper
async function graphqlQuery<T>(query: string, variables?: Record<string, any>): Promise<T> {
  const response = await saleorClient.post('', {
    query,
    variables,
  });
  
  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }
  
  return response.data.data;
}

// Saleor Product Types for Chemicals
export interface SaleorProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  attributes: SaleorAttribute[];
  variants: SaleorVariant[];
  metadata: Record<string, string>;
  isAvailable: boolean;
}

export interface SaleorAttribute {
  attribute: {
    name: string;
    slug: string;
  };
  values: {
    name: string;
    slug: string;
  }[];
}

export interface SaleorVariant {
  id: string;
  name: string;
  sku: string;
  pricing: {
    price: {
      gross: {
        amount: number;
        currency: string;
      };
    };
  };
  attributes: SaleorAttribute[];
  quantityAvailable: number;
}

// Chemical attribute mapping for Saleor
export const CHEMICAL_ATTRIBUTES = {
  CAS_NUMBER: 'cas-number',
  IUPAC_NAME: 'iupac-name',
  MOLECULAR_FORMULA: 'molecular-formula',
  MOLECULAR_WEIGHT: 'molecular-weight',
  CHEMICAL_GRADE: 'chemical-grade',
  PURITY: 'purity-percentage',
  FLASHPOINT: 'flashpoint-celsius',
  UN_HAZMAT: 'un-hazmat-number',
  REACH_STATUS: 'reach-status',
  TSCA_STATUS: 'tsca-status',
  STORAGE_CONDITIONS: 'storage-conditions',
  SHELF_LIFE: 'shelf-life-months',
} as const;

// Saleor API methods
export const saleorApi = {
  // Get products by chemical attributes
  getChemicals: async (filters?: {
    casNumber?: string;
    grade?: string;
    category?: string;
  }, first = 20): Promise<SaleorProduct[]> => {
    const query = `
      query GetChemicals($first: Int!, $filter: ProductFilterInput) {
        products(first: $first, filter: $filter) {
          edges {
            node {
              id
              name
              slug
              description
              category {
                id
                name
              }
              attributes {
                attribute {
                  name
                  slug
                }
                values {
                  name
                  slug
                }
              }
              variants {
                id
                name
                sku
                pricing {
                  price {
                    gross {
                      amount
                      currency
                    }
                  }
                }
                quantityAvailable
              }
              metadata {
                key
                value
              }
              isAvailable
            }
          }
        }
      }
    `;

    const filter: any = {};
    if (filters?.casNumber) {
      filter.attributes = [{ slug: CHEMICAL_ATTRIBUTES.CAS_NUMBER, values: [filters.casNumber] }];
    }
    if (filters?.category) {
      filter.categories = [filters.category];
    }

    const data = await graphqlQuery<{ products: { edges: { node: SaleorProduct }[] } }>(query, {
      first,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    });

    return data.products.edges.map(edge => edge.node);
  },

  // Get single chemical by slug
  getChemical: async (slug: string): Promise<SaleorProduct | null> => {
    const query = `
      query GetChemical($slug: String!) {
        product(slug: $slug) {
          id
          name
          slug
          description
          category {
            id
            name
          }
          attributes {
            attribute {
              name
              slug
            }
            values {
              name
              slug
            }
          }
          variants {
            id
            name
            sku
            pricing {
              price {
                gross {
                  amount
                  currency
                }
              }
            }
            attributes {
              attribute {
                name
                slug
              }
              values {
                name
                slug
              }
            }
            quantityAvailable
          }
          metadata {
            key
            value
          }
          isAvailable
        }
      }
    `;

    const data = await graphqlQuery<{ product: SaleorProduct | null }>(query, { slug });
    return data.product;
  },

  // Search chemicals
  searchChemicals: async (search: string, first = 20): Promise<SaleorProduct[]> => {
    const query = `
      query SearchChemicals($search: String!, $first: Int!) {
        products(first: $first, filter: { search: $search }) {
          edges {
            node {
              id
              name
              slug
              description
              category {
                id
                name
              }
              attributes {
                attribute {
                  name
                  slug
                }
                values {
                  name
                  slug
                }
              }
              variants {
                id
                name
                sku
                pricing {
                  price {
                    gross {
                      amount
                      currency
                    }
                  }
                }
                quantityAvailable
              }
              isAvailable
            }
          }
        }
      }
    `;

    const data = await graphqlQuery<{ products: { edges: { node: SaleorProduct }[] } }>(query, {
      search,
      first,
    });

    return data.products.edges.map(edge => edge.node);
  },

  // Get categories
  getCategories: async (first = 50): Promise<{ id: string; name: string; slug: string }[]> => {
    const query = `
      query GetCategories($first: Int!) {
        categories(first: $first, level: 0) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
      }
    `;

    const data = await graphqlQuery<{ categories: { edges: { node: { id: string; name: string; slug: string } }[] } }>(query, { first });
    return data.categories.edges.map(edge => edge.node);
  },

  // Create checkout (for orders)
  createCheckout: async (input: {
    email: string;
    lines: { variantId: string; quantity: number }[];
    shippingAddress?: any;
    billingAddress?: any;
  }): Promise<{ checkout: { id: string; token: string } }> => {
    const query = `
      mutation CreateCheckout($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            token
          }
          errors {
            field
            message
          }
        }
      }
    `;

    const data = await graphqlQuery<{ checkoutCreate: { checkout: { id: string; token: string }; errors: any[] } }>(query, { input });
    
    if (data.checkoutCreate.errors?.length > 0) {
      throw new Error(data.checkoutCreate.errors[0].message);
    }

    return { checkout: data.checkoutCreate.checkout };
  },

  // Add payment to checkout
  addPayment: async (checkoutId: string, paymentInput: {
    gateway: string;
    token: string;
    amount: number;
    currency: string;
  }): Promise<{ payment: { id: string } }> => {
    const query = `
      mutation AddPayment($checkoutId: ID!, $paymentInput: PaymentInput!) {
        checkoutPaymentCreate(checkoutId: $checkoutId, input: $paymentInput) {
          payment {
            id
          }
          errors {
            field
            message
          }
        }
      }
    `;

    const data = await graphqlQuery<{ checkoutPaymentCreate: { payment: { id: string }; errors: any[] } }>(query, {
      checkoutId,
      paymentInput,
    });

    if (data.checkoutPaymentCreate.errors?.length > 0) {
      throw new Error(data.checkoutPaymentCreate.errors[0].message);
    }

    return { payment: data.checkoutPaymentCreate.payment };
  },

  // Complete checkout
  completeCheckout: async (checkoutId: string): Promise<{ order: { id: string; number: string } }> => {
    const query = `
      mutation CompleteCheckout($checkoutId: ID!) {
        checkoutComplete(checkoutId: $checkoutId) {
          order {
            id
            number
          }
          errors {
            field
            message
          }
        }
      }
    `;

    const data = await graphqlQuery<{ checkoutComplete: { order: { id: string; number: string }; errors: any[] } }>(query, { checkoutId });

    if (data.checkoutComplete.errors?.length > 0) {
      throw new Error(data.checkoutComplete.errors[0].message);
    }

    return { order: data.checkoutComplete.order };
  },
};

// Helper to extract chemical attributes from Saleor product
export function extractChemicalAttributes(product: SaleorProduct): Record<string, string | string[]> {
  const attributes: Record<string, string | string[]> = {};
  
  product.attributes.forEach(attr => {
    const slug = attr.attribute.slug;
    const values = attr.values.map(v => v.name);
    attributes[slug] = values.length === 1 ? values[0] : values;
  });
  
  return attributes;
}

// Helper to get CAS number from product
export function getCASNumber(product: SaleorProduct): string | null {
  const attrs = extractChemicalAttributes(product);
  return attrs[CHEMICAL_ATTRIBUTES.CAS_NUMBER] as string || null;
}

// Helper to get grade from product
export function getChemicalGrade(product: SaleorProduct): string | null {
  const attrs = extractChemicalAttributes(product);
  return attrs[CHEMICAL_ATTRIBUTES.CHEMICAL_GRADE] as string || null;
}

export default saleorApi;
