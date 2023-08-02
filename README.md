# Feedback Form Demo

Inspired by Google Console, this is a demo of a feedback form that allows users to easily take a screenshot of the website and submit it together as part of their feedback / issue report. Users can also use a built-in editor to hide sensitive information on the screenshot.

This solution has **no third-party libraries** and uses native browser `getDisplayMedia()` API. However, as this API is relatively new, it is **not supported on mobile device browsers** yet.

Aside from an easy way of capturing screenshots

Live demo at [https://Milleus.github.io/feedback-form-demo/](https://Milleus.github.io/feedback-form-demo/).

<img src="./docs/form-example.jpg?raw=true" width="100%" alt="form example"/>

## Benefits

Having a screenshot of the current state of the website gives us better information on what the user faced such as error messages, error codes, visual bugs, etc.

Additional basic information such as timestamp, user agent, page title, page URL, description, username / email / contact can also be included. Most of these can be pre-populated and does not require user input.

A higher quality of feedback would help us to troubleshoot issues and improve the product faster.

## Limitations

As of 31 Jul 2023, `getDisplayMedia()` is only supported on Chrome, Edge, Safari, Firefox, Opera browsers but not on any mobile web browsers.

The current method of taking a screenshot also uses a video element instead of `ImageCapture` because of browser support.

## Ideas for improvement

- Allow users to drag a box to highlight sections of the screenshot.
- Turn the feedback form into a web component.
- Make a small package exporting screenshot taking functions.

## Useful resources

- [getDisplayMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia)
- [ImageCapture](https://developer.mozilla.org/en-US/docs/Web/API/ImageCapture)

## Author

- Website - [Dave Quah](https://milleus.github.io/)
- Frontend Mentor - [@Milleus](https://www.frontendmentor.io/profile/Milleus)
- CodePen - [@Milleus](https://codepen.io/Milleus)
- LinkedIn - [@Milleus](https://www.linkedin.com/in/milleus/)
- Twitter - [@Milleus](https://www.twitter.com/Milleus)
