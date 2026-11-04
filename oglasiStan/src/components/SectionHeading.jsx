import { Link } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';

export default function SectionHeading({ eyebrow, title, accent, description, linkTo, linkLabel = 'View all', center = false }) {
  return (
    <div className={`mb-10 flex flex-col gap-6 sm:mb-14 ${center ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'}`}>
      <div className={center ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <p className='eyebrow mb-4'>
            <span className='h-px w-6 bg-accent' />
            {eyebrow}
          </p>
        )}
        <h2 className='h-display text-4xl leading-[0.95] sm:text-5xl lg:text-6xl'>
          {title} {accent && <span className='accent-italic'>{accent}</span>}
        </h2>
        {description && <p className='mt-5 text-base leading-relaxed text-muted sm:text-lg'>{description}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className='group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ink'
        >
          <span className='border-b border-ink/20 pb-0.5 transition-colors group-hover:border-accent'>{linkLabel}</span>
          <span className='grid h-8 w-8 place-items-center rounded-full border border-line transition-all group-hover:border-accent group-hover:bg-accent group-hover:text-white'>
            <LuArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
          </span>
        </Link>
      )}
    </div>
  );
}
