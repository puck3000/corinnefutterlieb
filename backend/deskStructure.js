import S from '@sanity/desk-tool/structure-builder'

export default () =>
S.list()
    .title("Inhalt")
    .items([
        S.listItem()
        .title("Foto")
        .child(
            S.editor()
            .id('pdf')
            .schemaType(
                "pdf"
            )
            .documentId('foto-download')
        ),
        S.listItem()
        .title("Kunst")
        .child(
            S.editor()
            .id('pdf')
            .schemaType(
                "pdf"
            )
            .documentId('kunst-download')
        ),
        S.listItem()
        .title("Labor")
        .child(
            S.editor()
            .id('pdf')
            .schemaType(
                "pdf"
            )
            .documentId('labor-download')
        )
        
    ]);