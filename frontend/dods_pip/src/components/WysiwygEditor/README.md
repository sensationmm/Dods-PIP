##Quill

- docs URL: https://quilljs.com/docs/quickstart/
- api reference: https://quilljs.com/docs/api/

###Blots

- explanation + examples: https://github.com/quilljs/parchment/#blots

**Creating a blot**
1. Add a new ts file in `WysiwygEditor/blots`
2. Create your blot ... for simple reference you can copy one of the existing blots we have or refer to the above link
3. import the blot into the `WysiwygEditor/index.ts` file so that it can be registered with the library
4. from here you can add your blot (identified by the blotName field in the blot class) to the WysiwygEditor config, or you can programmatically consume it via the library's API (see content-tag for example)

There are 4 key features to creating a blot _(sorry didnt have time to write a ts class def)_
1. it MUST extend from either an existing blot or quills core blot types (blot/embed, blot/inline, blot/block)
2. it MUST have a `blotName` field in its class
3. it MUST have a STATIC `create` method which returns a quill node
4. it MUST call `Quill.register(BlotClassName)` to be added to the quill registry on import

Adding a blot definition to the toolbar config

1. add the `blotName` identifier to either of the config's arrays (wherever it's added will be the position it's displayed in)
2. this will yield a new button. if you've added a `className` field to your class, that css class will be added to your button as `ql-myclass`. you can then simply add a style in `WysiwygEditor/wysiwyg-editor.styles.tsx` and do as you wish with it
3. from here, you'll need to add an eventlister from within the WysiwygEditor/index.ts file to that button's selector
4. using the quill api methods, you can call your blot (usually with [quill.insertEmbed(...)](https://quilljs.com/docs/api/#insertembed), see `content-tag`)
5. job done
