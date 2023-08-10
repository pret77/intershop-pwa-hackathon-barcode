<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Accessibility

The goal of accessibility is to unlock the full potential of the Web and enable people with disabilities to participate equally.
The `@angular-eslint` repo contains a number of linting rules that can help enforce accessibility best practices in Angular component templates.

Most of the accessibility rules that are enabled in the Intershop PWA are contained in the plugin `@angular-eslint/template/accessibility` that is configured in the `.eslintrc.json` file of the project.
To check whether the rules are followed in your custom code or not, run `npm run lint`.

## General

Generally it is checked if valid `aria-*` and `role=*` attributes are used and that every necessary element is reachable with the keyboard, and that an action (like pressing enter) can be performed on them.

## Rules

Only some individual rules are written down here.
For reference which rules are currently included, please check the official repository:

- [ESLint-Plugin Accessibility Rules](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/src/configs/accessibility.json)

If an unreachable element has to be made reachable by providing a `tabindex`, the index should never be a positive number, only `0` (element is tab focusable) or `-1` (element is not tab focusable).
The tab-order has to be determined by the HTML-structure, not by the index.

<!-- titles instead of aria-attributes? -->
<!-- aria-labels as translation-keys? -->
<!-- use native html-elements instead of <div role=* />? -->

<!-- ------------------------------------------------------------------------------------------------------------------------------------------------  -->
<!-- ------------------------------------------------------------------------------------------------------------------------------------------------  -->
<!-- ------------------------------------------------------------------------------------------------------------------------------------------------  -->

> **How to fix `click-events-have-key-events` problems**
>
> To fix this, all of the `<a>` tags in the HTML files should have a `routerLink` attribute.
> If adding a meaningful `routerLink` is not possible, `[routerLink]="[]"` should be added to fix the error.
>
> Other HTML elements (`<div>`, `<span>`, etc.) with a `click()` event that report this ESLint error can be fixed by adding a `(keydown.enter)` event that should be assigned with the `click()` event's method.
> In addition a `tabindex="0"` needs to be added to such elements to make them tab focusable.

## Form Submission using the key "Enter"

Implicit form submission using the "Enter" key is vital to assistive technologies, see also [HTML5 specification](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission).
Therefore, the `form` tag has to include an `input` of `type="submit"`, for example

```html
<form>
  <label for="foo">Name:</label>
  <input type="text" name="foo" id="foo" />
  <input type="submit" value="Submit" />
</form>
```

or a button of type "submit"

```html
<form>
  <label for="foo">Name:</label>
  <input type="text" name="foo" id="foo" />
  <button type="submit">Submit</button>
</form>
```

### Form submission in dialogs

Dialogs (or modals) are separated into three sections:

- modal header
- modal body
- modal footer

where the form is positioned inside the model body and the buttons are positioned inside the modal footer.
The following simplified example shows the wrong HTML structure:

:warning: **Wrong HTML structure**

```html
<div class="modal-body">
  <form (ngSubmit)="submit()">
    <formly-form></formly-form>
  </form>
</div>
<div class="modal-footer">
  <button type="button" (click)="submit()">Submit</button>
  <button type="button" (click)="cancel()">Cancel</button>
</div>
```

The button with the text "Submit" calls the same function `foo()` as the form `(ngSubmit)` but the form would not be submitted using the "Enter" key because the submit button is positioned outside the `form` tag.
The following example shows the correct HTML structure:

:heavy_check_mark: **Correct HTML structure**

```html
<form (ngSubmit)="submit()">
  <div class="modal-body">
    <formly-form></formly-form>
  </div>
  <div class="modal-footer">
    <button type="submit">Submit</button>
    <button type="button" (click)="cancel()">Cancel</button>
  </div>
</form>
```

where

- the `form` tag surrounds both the formly form (including the form elements) and the submit button
- the function `submit()` is only called at the `form` tag
- the "Submit" button is correctly defined using `type="submit"` and does not call `submit()` using `(click)=""`
- the "Cancel" button is only defined as `type="button"` to prevent any default behavior

## Further References

- [Angular A11y ESLint Rules](https://dev.to/bitovi/angular-a11y-eslint-rules-2fjc)
- [Enforcing Accessibility with Angular A11y ESLint Rules](https://www.bitovi.com/blog/angular-a11y-eslint-rules)
- [Angular ESLint Rules for Keyboard Accessibility](https://dev.to/angular/angular-eslint-rules-for-keyboard-accessibility-236f)
- [Angular ESLint Rules for ARIA](https://dev.to/angular/angular-eslint-rules-for-aria-3ba1)
