# Adding Emmy.js to your Ruby on Rails project :railway_track:

### _Experimental_ `npx create-emmy`
[create-emmy](https://www.npmjs.com/package/create-emmy) is a command line tool that allows you to create a new emmy.js project.
It is still in an experimental phase, so it is not recommended to use it in production, but you can try it out and give us your feedback. [More info](https://github.com/emmyjs/create-emmy#readme)

### Usage
```bash
npx create-emmy <project-name> --rails --tailwind --run
```
**`--rails`** creates a [Ruby on Rails](https://rubyonrails.org/) project
**`--tailwind`** adds [Tailwind CSS](https://tailwindcss.com/) to the project
**`--run`** runs the project after creating it

## Quick Start
1. Use the `emmy-dom` CDN to import the `emmy-dom` package:
```bash
bin/importmap pin emmy-dom@latest --from jsdelivr
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