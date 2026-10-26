import type * as React from 'react';

export type IconName = 'pin' | 'route' | 'clock' | 'audio' | 'play' | 'pause' | 'locate' | 'layers' | 'globe' | 'check' | 'star' | 'stepfree' | 'back' | 'chevron' | 'chevron-down' | 'chevron-up' | 'arrow-right' | 'close'
  | 'landmark' | 'food' | 'shop' | 'tree' | 'art' | 'bench' | 'walk' | 'transit' | 'washroom' | 'coin' | 'alert' | 'hill' | 'wifi-off' | 'info' | 'eye' | 'flag' | 'heart' | 'heart-filled' | 'chat' | 'quote' | 'external' | 'share' | 'plus' | 'minus' | 'qr' | 'camera' | 'video' | 'phone' | 'columns';

export interface IconProps { name: IconName; size?: number; label?: string; className?: string }
export declare function Icon(props: IconProps): React.ReactElement;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'md' | 'sm';
  fullWidth?: boolean;
  icon?: IconName;
  iconEnd?: IconName;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  /** Required: becomes aria-label and the tooltip. Translate it. */
  label: string;
  variant?: 'float' | 'outline' | 'soft' | 'on-primary';
}
export declare function IconButton(props: IconButtonProps): React.ReactElement;

export interface BadgeProps { tone?: 'neutral' | 'primary' | 'current' | 'success' | 'reward' | 'new'; icon?: IconName; children?: React.ReactNode; className?: string }
export declare function Badge(props: BadgeProps): React.ReactElement;

export interface AppHeaderProps { title: React.ReactNode; subtitle?: React.ReactNode; brand?: boolean; onBack?: () => void; backLabel?: string; actions?: React.ReactNode; className?: string }
export declare function AppHeader(props: AppHeaderProps): React.ReactElement;

export interface PhotoPlateProps { src?: string; alt?: string; scene?: 'market' | 'flatiron' | 'cathedral' | 'park'; className?: string }
export declare function PhotoPlate(props: PhotoPlateProps): React.ReactElement;

export interface StopCardProps {
  title: string;
  number?: number;
  scene?: PhotoPlateProps['scene'];
  image?: string;
  imageAlt?: string;
  area?: React.ReactNode;
  walk?: React.ReactNode;
  status?: 'upcoming' | 'current' | 'visited';
  stamped?: boolean;
  stepFree?: boolean;
  layout?: 'stack' | 'row';
  onListen?: () => void;
  stopLabel?: string; visitedLabel?: string; currentLabel?: string; stampedLabel?: string; stepFreeLabel?: string; listenLabel?: string;
  className?: string;
}
export declare function StopCard(props: StopCardProps): React.ReactElement;

export interface ProgressIndicatorProps { total: number; visited: number; current?: boolean; label?: string; distance?: React.ReactNode; className?: string }
export declare function ProgressIndicator(props: ProgressIndicatorProps): React.ReactElement;

export interface StampBadgeProps { label: string; earned?: boolean; date?: React.ReactNode; size?: 'md' | 'lg'; lockedHint?: string; earnedText?: string; lockedText?: string; className?: string }
export declare function StampBadge(props: StampBadgeProps): React.ReactElement;

export interface RouteStop { x: number; y: number; status?: 'upcoming' | 'current' | 'visited' | 'here' | 'next' | 'skipped'; name: string }
export interface RouteMapProps { stops?: RouteStop[]; legs?: Array<Array<[number, number]>>; me?: [number, number] | null;
  streets?: Array<[number, number, number, number, number?]>; labels?: Array<[number, number, string]>; parks?: Array<[number, number, number, number]>; water?: string | null; cautions?: Array<[number, number, string?]>;
  /** Getting there: walking lines from a station to Stop 1 (City-blue dashed). */
  access?: Array<Array<[number, number]>>; stations?: Array<{ x: number; y: number; name?: string }>;
  activeLeg?: number;
  /** One state per leg; wins over activeLeg. Use when a plan skips stops and legs join non-neighbouring stops. */
  legStates?: Array<'done' | 'active' | 'ahead'>;
  onStop?: (index: number) => void; label?: string; className?: string }
export declare function RouteMap(props: RouteMapProps): React.ReactElement;

export interface WalkSpineLeg { metres?: number; minutes?: number }
export interface WalkSpineProps { legs: WalkSpineLeg[]; current?: number | null; size?: 'full' | 'compact'; width?: number; minGap?: number; longestLabel?: string;
  /** Stop number shown under each tick (defaults to 1, 2, 3…). Use original stop numbers when a plan skips stops. */
  labels?: Array<string | number>; label?: string; className?: string }
export declare function WalkSpine(props: WalkSpineProps): React.ReactElement;

export interface StrollMapStroll { id: string; lat: number; lon: number; count: number; pilot?: boolean; tag?: string; far?: boolean; stops?: Array<[number, number, IconName?]> }
export interface StrollMapProps {
  base: { shore?: Array<[number, number]>; islands?: Array<[number, number]>; spit?: Array<[number, number]>;
    streets?: Array<{ name: string; major?: boolean; parts: Array<Array<[number, number]>> }>;
    lines?: Array<{ id: string; name: string; color: string; stops: Array<[string, number, number]> }>;
    cars?: Array<{ route: string; name: string; parts: Array<Array<[number, number]>> }> };
  strolls: StrollMapStroll[]; focus?: { lat: number; lon: number; mpp: number; key: string }; width?: number; height?: number;
  selectedId?: string | null; activeStop?: number | null; showTransit?: boolean; pickStation?: boolean;
  station?: { name: string; lat: number; lon: number } | null; reachIds?: string[] | null; me?: { lat: number; lon: number } | null;
  onSelect?: (id: string) => void; onStop?: (index: number) => void; onStation?: (name: string) => void;
  label?: string; zoomInLabel?: string; zoomOutLabel?: string; className?: string }
export declare function StrollMap(props: StrollMapProps): React.ReactElement;

export interface PassportBadgeProps { total: number; collected?: number[]; label?: string; size?: 'sm' | 'md' | 'lg'; statusText?: string; showStatus?: boolean; showLabel?: boolean; className?: string }
export declare function PassportBadge(props: PassportBadgeProps): React.ReactElement;

export interface BottomSheetProps { title?: React.ReactNode; eyebrow?: React.ReactNode; label?: string; height?: number | string; expanded?: boolean; onToggle?: () => void; handleLabel?: string; children?: React.ReactNode; className?: string }
export declare function BottomSheet(props: BottomSheetProps): React.ReactElement;

declare global {
  interface Window {
    StrollTO: {
      Icon: typeof Icon; Button: typeof Button; IconButton: typeof IconButton; Badge: typeof Badge; AppHeader: typeof AppHeader;
      PhotoPlate: typeof PhotoPlate; StopCard: typeof StopCard; ProgressIndicator: typeof ProgressIndicator; StampBadge: typeof StampBadge;
      RouteMap: typeof RouteMap; BottomSheet: typeof BottomSheet; WalkSpine: typeof WalkSpine; StrollMap: typeof StrollMap; PassportBadge: typeof PassportBadge;
    };
  }
}
