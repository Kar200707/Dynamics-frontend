import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimations', [
    // Define the transitions for Home -> Search, Search -> Home, etc.
    transition('HomePage <=> SearchPage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ], { optional: true }),
      query(':enter', [
        style({ left: '-100%' }), // Enter from left for forward navigation
      ], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '100%' })), // Leave to right for forward navigation
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%' })), // Enter from left for forward navigation
        ], { optional: true }),
      ]),
    ]),
    // Define the transitions for Search -> Library, Library -> Search, etc.
    transition('SearchPage <=> LibraryPage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ], { optional: true }),
      query(':enter', [
        style({ left: '-100%' }), // Enter from left for forward navigation
      ], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '100%' })), // Leave to right for forward navigation
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%' })), // Enter from left for forward navigation
        ], { optional: true }),
      ]),
    ]),
    // Default transition for any other route change (left-right animation)
    transition('* <=> *', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ], { optional: true }),
      query(':enter', [
        style({ left: '-100%' }), // Enter from left for forward navigation
      ], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '100%' })), // Leave to right for forward navigation
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%' })), // Enter from left for forward navigation
        ], { optional: true }),
        query('@*', animateChild(), { optional: true }),
      ]),
    ]),
  ]);
