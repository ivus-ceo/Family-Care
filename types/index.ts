import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { MarkerOptions, LatLngLiteral, DragEndEvent } from 'leaflet'

export type ID = number
export type IDColumn = { id: ID }
export type UserID = string
export type UserIDColumn = { id: UserID }

export type Name = {
    first_name: string
    last_name: string
}

export type UserMetaData = Name & { team_code: string | null }

export type Coords = {
    latitude: number
    longitude: number
}

export type User = Omit<SupabaseUser, 'user_metadata'> & { user_metadata: UserMetaData };

export type Profile = UserIDColumn & UserMetaData

export type Geolocation = IDColumn & Coords & {
    profile_id: UserID
}

export type ProfileWithGeolocation = UserIDColumn & UserMetaData & {
    geolocations: Coords | null
}

export type Marker = MarkerOptions & LatLngLiteral & UserMetaData

export type Tab = {
    label: string
    href: string
    icon: string
}

export type Switch = {
    label: string
    icon: string
    user: ProfileWithGeolocation
}

export type Breadcrumb = {
    label: string
    icon: string
    to?: string
}