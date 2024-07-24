# CHANGELOG

## 1.5.3 (2024-07-24)


### Bug Fixes

* **Root:** Fix createPageComponent: must asyncronously fetch the html and load it as a component ([0af976f](https://github.com/emmyjs/emmy-dom/commit/0af976f3a37e0ab82b163f3dfba025702484d642))
* **Root:** Fix StyleObject type: now it accepts Objects inside Objects, not just string values ([7701d02](https://github.com/emmyjs/emmy-dom/commit/7701d022333671e3800431d249e7064d18cb8075))
* **Root:** Update ComponentType to support the new functional components sintax with props ([de72d26](https://github.com/emmyjs/emmy-dom/commit/de72d2624ccf7ac43a5ef96ad28c870a8e621b93))



## [1.5.2](https://github.com/emmyjs/emmy-dom/compare/1.5.1...1.5.2) (2024-07-22)


### Bug Fixes

* **Root:** Fix css parsing of strings ([443c0c5](https://github.com/emmyjs/emmy-dom/commit/443c0c55b9c7e3c669c00a1f2a4af560e95111cc))
* **Root:** Fix processGenerator: closing tags must not have attributes and tags must not have unnece ([1f280fd](https://github.com/emmyjs/emmy-dom/commit/1f280fd434d5569f478d317a561b5b8cb2035234))



## [1.5.1](https://github.com/emmyjs/emmy-dom/compare/1.5.0...1.5.1) (2024-07-22)



# [1.5.0](https://github.com/emmyjs/emmy-dom/compare/1.4.0...1.5.0) (2024-06-10)


### Bug Fixes

* **Root:** Add import extension to react-style-object-to-css ([c4c236a](https://github.com/emmyjs/emmy-dom/commit/c4c236ab176f1db50f1691a144c0201740da7dd7))



# [1.4.0](https://github.com/emmyjs/emmy-dom/compare/1.3.0...1.4.0) (2024-06-10)


### Bug Fixes

* **Root:** Add explicit import extensions because typescript do not include extensions automatically ([f88e5ba](https://github.com/emmyjs/emmy-dom/commit/f88e5ba49d0d8c547e875b3377d57ece1fd1cdf5))


### Performance Improvements

* **Root:** Remove unused code ([14c433b](https://github.com/emmyjs/emmy-dom/commit/14c433b242555ffb8ea108ae304d6afd5f4677cd))



# [1.3.0](https://github.com/emmyjs/emmy-dom/compare/1.2.0...1.3.0) (2024-05-18)


### Bug Fixes

* **Root:** Fix cdn compatibility migrating commonjs dependencies ([d8f3c30](https://github.com/emmyjs/emmy-dom/commit/d8f3c308e312d4c8ae86ef602b6b996da5736b12))



# [1.2.0](https://github.com/emmyjs/emmy-dom/compare/1.1.0...1.2.0) (2024-02-10)


### Features

* **Root:** Add global variable Emmy & Add jsx function for JSX in client side ([e5c9043](https://github.com/emmyjs/emmy-dom/commit/e5c904335599a9240f063ba17fbf7f10778731ab))



# [1.1.0](https://github.com/emmyjs/emmy-dom/compare/1.0.0...1.1.0) (2024-02-08)


### Features

* **Root:** Add Auto-close tags feat ([a1546a0](https://github.com/emmyjs/emmy-dom/commit/a1546a00e16b667bffa2a78e4a80e1e148612543))



# 1.0.0 (2024-01-07)



# [1.0.0](https://github.com/emmyjs/emmy-dom/compare/0.1.2...1.0.0) (2024-01-07)


### Bug Fixes

* **Root:** Fix custom element redefining due to the constructor usage ([00daf04](https://github.com/emmyjs/emmy-dom/commit/00daf04100aa9f62bf6d89087cfa557bac770947))
* **Root:** Fix tests & json parsing ([7fbb33a](https://github.com/emmyjs/emmy-dom/commit/7fbb33a3dad9b9d6c350406e36825216c408ddae))


### Features

* **Root:** Add didMount state ([433962b](https://github.com/emmyjs/emmy-dom/commit/433962b646739621bd5f25bb3b8cad4cd59ef095))
* **Root:** Add html tag function ([ec29433](https://github.com/emmyjs/emmy-dom/commit/ec294336469ac9353f1d067d3051cc01a9c9252c))
* **Root:** Add props to functional components ([d5b672f](https://github.com/emmyjs/emmy-dom/commit/d5b672fe404092a49b36d27b24d158c0c6c05652))
* **Root:** Remove behave method of components ([caaa469](https://github.com/emmyjs/emmy-dom/commit/caaa4698df5e9dc0dab67c888efd96368def7943))


### Reverts

* Revert "Add README" ([eef429f](https://github.com/emmyjs/emmy-dom/commit/eef429fa1fe070936bfe141b4609823bfcfb5a38))



