# Adding Emmy.js to your Ruby on Rails project :railway_track:

## Quick Start
1. Use the `emmy-dom` CDN to import the `emmy-dom` package:
```bash
bin/importmap pin emmy-dom --url https://cdn.jsdelivr.net/npm/emmy-dom@latest
```
2. Add the following to your `app/views/layouts/application.html.erb` file, if it doesn't already exist:
```html
<%= javascript_importmap_tags %>
```
3. Use the `emmy-dom` package in your JavaScript files:
```javascript
import { LightComponent, launch } from "emmy-dom";

class MyComponent extends LightComponent {
    constructor() {
        super();
        render(`<div>Hello World!</div>`);
    }
}

launch(MyComponent);
```

## Alternative Installation
1. Install the `emmy-dom` npm package:
```bash
npm i emmy-dom
```
2. Use importmap to import the `emmy-dom` package:
```bash
bin/importmap pin emmy-dom --download