// /docs/content_models/sanity_schemas.ts
import { defineType, defineField } from 'sanity'

export const series = defineType({
  name: 'series',
  title: 'Series',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'summary', type: 'text' }),
    defineField({ name: 'year', type: 'number' }),
    defineField({ name: 'genre', type: 'string', options: { list: ['street','nature','monochrome','sports'] } }),
    defineField({ name: 'location', type: 'string' }),
    defineField({ name: 'heroImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'photos', type: 'array', of: [{ type: 'reference', to: [{ type: 'photo' }] }] }),
    defineField({ name: 'statement', type: 'text' }),
    defineField({ name: 'credits', type: 'array', of: [{ type: 'reference', to: [{ type: 'credit' }] }] }),
  ]
})

export const photo = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({ name: 'file', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'caption', type: 'string' }),
    defineField({ name: 'shotAt', type: 'datetime' }),
    defineField({ name: 'exif', type: 'object', fields: [
      { name: 'camera', type: 'string' },
      { name: 'lens', type: 'string' },
      { name: 'focal', type: 'number' },
      { name: 'shutter', type: 'string' },
      { name: 'aperture', type: 'string' },
      { name: 'iso', type: 'number' },
    ]}),
    defineField({ name: 'people', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'location', type: 'string' }),
    defineField({ name: 'alt', type: 'string' }),
    defineField({ name: 'license', type: 'string' }),
    defineField({ name: 'iptcEmbed', type: 'boolean', initialValue: true }),
  ]
})

export const credit = defineType({
  name: 'credit',
  title: 'Credit',
  type: 'document',
  fields: [
    defineField({ name: 'client', type: 'string' }),
    defineField({ name: 'role', type: 'string' }),
    defineField({ name: 'year', type: 'number' }),
    defineField({ name: 'link', type: 'url' }),
  ]
})
