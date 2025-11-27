import Link from 'next/link';
import { InfinityAnimation, AtomIcon, StateFlowIcon } from '@/components/icons';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-8 sm:pb-20 lg:flex lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-4">
            <div className="mt-8 sm:mt-12 lg:mt-8">
              <a
                href="https://github.com/titanstate/titanstate"
                className="inline-flex space-x-6"
              >
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-500/10">
                  What's new
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                  <span>Just shipped v0.1.0</span>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              The React Framework for State Management
            </h1>
            <p className="mt-5 text-lg leading-7 text-gray-600 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              TitanState enables you to create <strong className="text-gray-900">high-quality state management</strong> with
              the power of atom-based reactivity. Handle 100MB+ datasets with lazy loading,
              compression, and efficient memory management.
            </p>
            <div className="mt-8 flex items-center gap-x-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link
                href="/docs/getting-started"
                className="group rounded-md bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                Get started
                <span className="inline-block ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/docs"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700 transition-colors duration-200 group"
              >
                Documentation <span className="inline-block ml-1 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          {/* Animated Infinity SVG */}
          <div className="mt-16 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            <div className="flex justify-center lg:justify-end">
              <InfinityAnimation className="w-full max-w-md lg:max-w-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Built for scale and performance
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            TitanState provides everything you need to build scalable applications with large
            datasets while maintaining excellent developer experience.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-20 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col group">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 group-hover:bg-indigo-700 group-hover:scale-110 transition-all duration-200">
                  <AtomIcon size={24} className="text-white" />
                </div>
                Atom-based Architecture
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Fine-grained reactivity with structural sharing. Each atom is the smallest
                  addressable reactive unit, enabling efficient updates and minimal re-renders.
                </p>
              </dd>
            </div>
            <div className="flex flex-col group">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 group-hover:bg-indigo-700 group-hover:scale-110 transition-all duration-200">
                  <StateFlowIcon size={24} className="text-white" />
                </div>
                Lazy Hydration
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Large datasets are loaded on-demand from persistent storage. Atoms are only
                  hydrated when accessed, keeping initial load times fast.
                </p>
              </dd>
            </div>
            <div className="flex flex-col group">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 group-hover:bg-indigo-700 group-hover:scale-110 transition-all duration-200">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                </div>
                Web Worker Support
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Offload heavy computations to Web Workers. Keep your main thread responsive
                  while processing large datasets in the background.
                </p>
              </dd>
            </div>
            <div className="flex flex-col group">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 group-hover:bg-indigo-700 group-hover:scale-110 transition-all duration-200">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
                Time-Travel Debugging
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Event-based debugging with state reconstruction. Jump to any point in your
                  application's history and inspect the state at that moment.
                </p>
              </dd>
            </div>
            <div className="flex flex-col group">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 group-hover:bg-indigo-700 group-hover:scale-110 transition-all duration-200">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    />
                  </svg>
                </div>
                Modular Architecture
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Pluggable storage drivers, middleware system, and optional features. Use only
                  what you need, when you need it.
                </p>
              </dd>
            </div>
            <div className="flex flex-col group">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 group-hover:bg-indigo-700 group-hover:scale-110 transition-all duration-200">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
                TypeScript First
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Built with TypeScript from the ground up. Full type safety, excellent IDE
                  support, and comprehensive type definitions.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900">
        <div className="px-6 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Start building with TitanState today. Get up and running in minutes with our
              comprehensive documentation and examples.
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Link
                href="/docs/getting-started"
                className="group rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                Get started
                <span className="inline-block ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/docs"
                className="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors duration-200 group"
              >
                Learn more <span className="inline-block ml-1 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

