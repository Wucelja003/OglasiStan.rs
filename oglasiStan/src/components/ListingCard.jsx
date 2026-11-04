import { Link } from 'react-router-dom';
import { LuArrowUpRight, LuBath, LuBedDouble, LuMapPin, LuRuler, LuHouse } from 'react-icons/lu';
import SpotlightCard from './rb/SpotlightCard';
import { optimizeImg } from '../utils/img';
import { formatPrice, pricePerM2, typeLabel, isRent } from '../utils/format';

export default function ListingCard({ listing }) {
  const cover = listing.imagesUrls?.[0];
  const perM2 = pricePerM2(listing.regularPrice, listing.area);

  // Bez _id (npr. živi pregled u formi) renderujemo običan div umesto linka
  const Wrapper = listing._id ? Link : 'div';
  const wrapperProps = listing._id ? { to: `/listing/${listing._id}` } : {};

  return (
    <Wrapper {...wrapperProps} className='group block h-full'>
      <SpotlightCard
        className='h-full rounded-3xl p-2.5 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_24px_50px_-28px_rgba(34,30,26,0.45)]'
        style={{ '--spotlight-card-surface': '#FDF9F4', '--spotlight-card-border': '#DDD7CC', '--spotlight-card-shadow': '0 1px 2px rgba(34,30,26,0.04)' }}
        spotlightColor='rgba(224, 123, 42, 0.14)'
        theme="light"
      >
        {/* Slika */}
        <div className='relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand'>
          {cover ? (
            <img
              src={optimizeImg(cover, 640)}
              alt={listing.name}
              loading='lazy'
              className='h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]'
            />
          ) : (
            <div className='bg-grid grid h-full w-full place-items-center'>
              <LuHouse className='h-10 w-10 text-ink/15' />
            </div>
          )}

          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] backdrop-blur-md ${
            isRent(listing.type) ? 'bg-accent text-white' : 'bg-cream/90 text-ink backdrop-blur-md'
          }`}>
            {typeLabel(listing.type)}
          </span>

          <span className='absolute right-3 top-3 grid h-9 w-9 translate-y-1 place-items-center rounded-full bg-espresso text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
            <LuArrowUpRight className='h-4 w-4' />
          </span>
        </div>

        {/* Info */}
        <div className='relative px-3 pb-3 pt-4'>
          <div className='flex items-baseline justify-between gap-3'>
            <p className='font-display text-2xl font-semibold tracking-tight text-ink'>
              {formatPrice(listing.regularPrice)}
              {isRent(listing.type) && <span className='ml-1 text-sm font-medium text-dim'>/mo</span>}
            </p>
            {perM2 && (
              <span className='shrink-0 font-sans text-[11px] text-accent'>
                {formatPrice(perM2)}/m²
              </span>
            )}
          </div>

          <h3 className='mt-1.5 truncate text-[15px] font-semibold text-ink/90'>{listing.name || 'Your listing title'}</h3>
          <p className='mt-1 flex items-center gap-1.5 truncate text-sm text-muted'>
            <LuMapPin className='h-3.5 w-3.5 shrink-0 text-dim' />
            <span className='truncate'>{listing.address || 'Address'}</span>
          </p>

          <div className='mt-4 flex flex-wrap items-center gap-x-3.5 gap-y-1 whitespace-nowrap border-t border-line pt-4 text-xs text-muted'>
            <span className='flex items-center gap-1.5'><LuBedDouble className='h-4 w-4 text-dim' />{listing.bedrooms} bd</span>
            <span className='flex items-center gap-1.5'><LuBath className='h-4 w-4 text-dim' />{listing.bathrooms} ba</span>
            {listing.area > 0 && (
              <span className='flex items-center gap-1.5'><LuRuler className='h-4 w-4 text-dim' />{listing.area} m²</span>
            )}
          </div>
        </div>
      </SpotlightCard>
    </Wrapper>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className='overflow-hidden rounded-2xl border border-line bg-card'>
      <div className='aspect-[4/3] animate-pulse bg-sand' />
      <div className='space-y-3 p-5'>
        <div className='h-6 w-1/2 animate-pulse rounded bg-line' />
        <div className='h-4 w-3/4 animate-pulse rounded bg-sand' />
        <div className='h-4 w-1/3 animate-pulse rounded bg-sand' />
      </div>
    </div>
  );
}
