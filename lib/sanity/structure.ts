import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('ESOES İçerik')
    .items([
      // Calendar Events
      S.listItem()
        .title('Takvim Etkinlikleri')
        .child(
          S.documentTypeList('event')
            .title('Takvim Etkinlikleri')
            .filter('_type == "event"')
        ),
      // Departments
      S.listItem()
        .title('Departmanlar')
        .child(
          S.documentTypeList('department')
            .title('Departmanlar')
            .filter('_type == "department"')
        ),
      // Users
      S.listItem()
        .title('Kullanıcılar')
        .child(
          S.documentTypeList('user')
            .title('Kullanıcılar')
            .filter('_type == "user"')
        ),
      // FAQs
      S.listItem()
        .title('Sık Sorulan Sorular')
        .child(
          S.documentTypeList('faq')
            .title('Sık Sorulan Sorular')
            .filter('_type == "faq"')
        ),
      // Gallery
      S.listItem()
        .title('Galeri')
        .child(
          S.documentTypeList('gallery')
            .title('Galeri')
            .filter('_type == "gallery"')
        ),
      // Event Archive
      S.listItem()
        .title('Etkinlik Arşivi')
        .child(
          S.documentTypeList('event_archive')
            .title('Etkinlik Arşivi')
            .filter('_type == "event_archive"')
        ),
      S.divider(),
      // Show any other document types that might exist
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['event', 'department', 'user', 'faq', 'gallery', 'event_archive'].includes(item.getId()!),
      ),
    ])
