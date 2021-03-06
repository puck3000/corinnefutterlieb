// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  name: 'default',
  // Then proceed to concatenate our our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([{
    title: 'pdf',
    name: 'pdf',
    type: 'document',
    fields: [{
        name: 'title',
        type: 'string',
        title: 'Titel',
      },
      {
        name: 'pdf',
        type: 'file',
        title: 'PDF',
        storeOriginalFilename: true
      }
      // ,
      // {
      //   name: 'description',
      //   type: 'text',
      //   title: 'Beschreibung',
      //   description: 'Eine kurze Beschreibung des Inhaltes des PDFs. Gut fuer Suchmaschinen.'
      // }
    ]
  }])
})