import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Info } from 'react-feather';
import {string, number, shape, arrayOf} from 'prop-types';
import { Link } from 'react-router-dom';
import Price from '@magento/venia-ui/lib/components/Price';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import GalleryItemShimmer from '@magento/venia-ui/lib/components/Gallery/item.shimmer';
import defaultClasses from './item.module.css';
import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';
import QuantityStepper from '@magento/venia-ui/lib/components/QuantityStepper';

import AddToCartbutton from '@magento/venia-ui/lib/components/Gallery/addToCartButton';
// eslint-disable-next-line no-unused-vars

import SelectValue from "./SelectValue";

import { Form } from 'informed';
import operations from "@magento/venia-ui/lib/components/MiniCart/miniCart.gql";

// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 228;

const IMAGE_HEIGHT = 228;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map()
    .set(228, IMAGE_WIDTH)
    .set(UNCONSTRAINED_SIZE_KEY, 228);

const GalleryItem = props => {
    const {
        handleLinkClick,
        item,
        wishlistButtonProps,
        isSupportedProductType
    } = useGalleryItem(props);

    const { storeConfig } = props;

    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;

    const classes = useStyle(defaultClasses, props.classes);

    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }
    // eslint-disable-next-line no-unused-vars

    const { name, price_range, small_image, url_key, rating_summary, special_price, media_gallery, image } = item;
    console.log(item)
    const { url: smallImageURL } = small_image;
    const { url: imageURL } = media_gallery[0];
    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);

    const wishlistButton = wishlistButtonProps ? (
        <WishlistGalleryButton {...wishlistButtonProps} />
    ) : null;

    // dodanie wartości z selecta
    const selectedValue = item.id.value;
    const addButton = isSupportedProductType ? (
        <AddToCartbutton item={item} urlSuffix={productUrlSuffix} />
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'galleryItem.unavailableProduct'}
                    defaultMessage={'Currently unavailable for purchase.'}
                />
            </p>
        </div>
    );

    const inStock = addButton.props.item? addButton.props.item.stock_status : false

    const initialValue = 1;
    // fallback to regular price when final price is unavailable
    const regularPrice = price_range.maximum_price.regular_price;
    console.log(special_price)
    const finalPrice = special_price ? special_price : '';

    // Hide the Rating component until it is updated with the new look and feel (PWA-2512).
    const ratingAverage = rating_summary ? (
        <Rating rating={rating_summary} />
    ) : null;

    return (
        <div
            data-cy="GalleryItem-root"
            className={classes.root}
            aria-live="polite"
            aria-busy="false"
        >
            {wishlistButton}
            <Link
                onClick={handleLinkClick}
                to={productLink}
                className={classes.images}
            >
                <Image
                    alt={name}
                    classes={{
                        image: classes.image,
                        loaded: classes.imageLoaded,
                        notLoaded: classes.imageNotLoaded,
                        root: classes.imageContainer
                    }}
                    height={IMAGE_HEIGHT}
                    resource={smallImageURL}
                    widths={IMAGE_WIDTHS}
                />
                <Image
                    alt={name}
                    classes={{
                        image: classes.imageHover,
                        loaded: classes.imageLoaded,
                        notLoaded: classes.imageNotLoaded,
                        root: classes.imageContainer
                    }}
                    height={IMAGE_HEIGHT}
                    resource={imageURL}
                    widths={IMAGE_WIDTHS}
                />
                {ratingAverage}
            </Link>
            <Link
                onClick={handleLinkClick}
                to={productLink}
                className={classes.name}
                data-cy="GalleryItem-name"
            >
                <span>{name}</span>
            </Link>
            <div data-cy="GalleryItem-price" className={classes.price}>
                <Price
                    value={regularPrice.value}
                    currencyCode={regularPrice.currency}
                />
            </div>
            {
                finalPrice &&
                <div className={classes.specialPrice}>

                    <Price
                        value={special_price}
                        currencyCode={regularPrice.currency}
                    />
                </div>
            }

            <Form className={classes.actionsContainer}
                  initialValues={{quantity: initialValue}}
            >
                {' '}
                { inStock &&
                    <QuantityStepper
                        classes={{ root: classes.quantityRoot }}
                        min={1}

                    />
                }
                {addButton}
            </Form>
        </div>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageHover: string,
        imageLoaded: string,
        imageNotLoaded: string,
        imageContainer: string,
        images: string,
        name: string,
        price: string,
        root: string
    }),
    item: shape({
        id: number.isRequired,
        uid: string.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        stock_status: string.isRequired,
        __typename: string.isRequired,
        url_key: string.isRequired,
        sku: string.isRequired,
        price_range: shape({
            maximum_price: shape({
                final_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }),
                regular_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    }),
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired,
        product_url_suffix: string
    }),
    items: arrayOf(
        shape({
            value: number
        })
    )
};

export default GalleryItem;
