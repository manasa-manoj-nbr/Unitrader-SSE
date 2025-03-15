import React, { useState } from 'react';
import cn from 'classnames';
import AppLink from '../AppLink';
import styles from './Card.module.sass';
import Icon from '../Icon';
import Image from '../Image';

const Card = ({ className, item }) => {
  const [visible, setVisible] = useState(false);

  const PriceDisplay = () => {
    // Use a fallback value ('') if color is null or undefined
    const color = item?.metadata?.color || ''
    const isAuction = color.toLowerCase() === 'auction'

    return (
      <span className={cn(styles.price, 'flex items-center gap-2')}>
        <span>₹ {item?.metadata?.price}</span>
        {isAuction && (
          <>
            <style>
              {`
              @keyframes fadeInOut {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
              }
              .fade {
                animation: fadeInOut 1s infinite;
              }
            `}
            </style>
            <span className="fade" style={{ color: 'red', marginLeft: '4px' }}>
              LIVE
            </span>
          </>
        )}
      </span>
    )
  }


  return (
    <div className={cn(styles.card, className)} aria-hidden="true">
      <AppLink className={styles.link} href={`/item/${item?.slug}` || '/'}>
        <div className={styles.preview}>
          <Image
            size={{ width: '100%', height: '360px' }}
            src={item?.metadata?.image?.imgix_url}
            alt="Card"
            objectFit="cover"
          />
          <div className={styles.control}>
            <div className={styles.category}>{item?.title}</div>
            <button
              className={cn(styles.favorite, { [styles.active]: visible })}
              onClick={() => setVisible(!visible)}
            >
              <Icon name="heart" size="20" />
            </button>
            <button className={cn('button-small', styles.button)}>
              <span>{`${item?.metadata?.categories[0]?.title}`}</span>
              <Icon name="scatter-up" size="16" />
            </button>
          </div>
        </div>
        <div className={styles.foot}>
          <div className={styles.status}>
            <p>{item?.title}</p>
            <p className={styles.count}>
              {item?.metadata?.count > 0
                ? `${item?.metadata?.count} Items`
                : 'Not Available'}
            </p>
          </div>
          <div
            className={styles.bid}
            dangerouslySetInnerHTML={{ __html: item?.count }}
          />
          <PriceDisplay />
        </div>
      </AppLink>
    </div>
  );
};

export default Card;