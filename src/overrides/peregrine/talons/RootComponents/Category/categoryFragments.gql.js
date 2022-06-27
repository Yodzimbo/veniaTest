import { gql } from '@apollo/client';

export const CategoryFragment = gql`
    # eslint-disable-next-line @graphql-eslint/require-id-when-available
    fragment CategoryFragment on CategoryTree {
        uid
        meta_title
        meta_keywords
        meta_description
    }
`;

export const ProductsFragment = gql`
    fragment ProductsFragment on Products {
        items {
            id
            uid
            name
            price_range {
                maximum_price {
                    final_price {
                        currency
                        value
                    }
                    regular_price {
                        currency
                        value
                    }
                }
            }
            image {
                url
            }
            thumbnail {
                url
            }
            media_gallery {
                url
            }
            ... on GroupedProduct {
                items {
                    qty
                    position
                    product {
                        id
                        uid
                        sku
                        name
                        stock_status
                        __typename
                        url_key
                    }
                }
            }
            swatch_image
            special_price
            sku
            small_image {
                url
            }
            stock_status
            rating_summary
            __typename
            url_key
        }
        page_info {
            total_pages
        }
        total_count
    }
`;
