# Feedback Form Demo

Inspired by Google Console, this is a demo of a feedback form that allows users to easily take a screenshot of the website and submit it together as part of their feedback to the site owner. Users can also use the built-in editor to hide sensitive information on the screenshot.

This solution has **no third-party libraries** and uses native browser `getDisplayMedia()` API. However, as this API is relatively new, it is **not supported on mobile device browsers** yet.

Live demo at [https://Milleus.github.io/feedback-form-demo/](https://Milleus.github.io/feedback-form-demo/).

<img src="./docs/form-example.jpg?raw=true" width="100%" alt="form example"/>

## Benefits

This form can be made into a web component which can be easily added to webpages instead of a redirection to another page. This allows us to capture more information on the page that users are on. The following can be sent as part of the feedback:

- description (user filled via form)
- screenshot (user filled via form, using native browser API)
- timestamp
- user agent
- page title
- page url

Other information such as username, email, contact number, or accessibility settings (e.g. contrast preference, motion preference, etc) can also be included.

## Limitations

As of 31 Jul 2023, `getDisplayMedia()` is only supported on Chrome, Edge, Safari, Firefox, Opera browsers but not on any mobile web browsers. See [https://caniuse.com/?search=getdisplaymedia](https://caniuse.com/?search=getdisplaymedia).

The current method of taking a screenshot also uses a video element instead of `ImageCapture` because of browser support. See [https://caniuse.com/?search=imagecapture](https://caniuse.com/?search=imagecapture).

## Useful resources

- [getDisplayMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia)
- [ImageCapture](https://developer.mozilla.org/en-US/docs/Web/API/ImageCapture)

## Author

- Website - [Dave Quah](https://milleus.github.io/)
- Frontend Mentor - [@Milleus](https://www.frontendmentor.io/profile/Milleus)
- CodePen - [@Milleus](https://codepen.io/Milleus)
- LinkedIn - [@Milleus](https://www.linkedin.com/in/milleus/)
- Twitter - [@Milleus](https://www.twitter.com/Milleus)
