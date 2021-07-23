const smButton = document.createElement('template')
smButton.innerHTML = `
<style>     
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
}       
:host{
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    width: auto;
    --accent-color: #4d2588;
    --text-color: 17, 17, 17;
    --background-color: 255, 255, 255;
    --padding: 0.6rem 1.2rem;
    --border-radius: 0.3rem;
    --background: rgba(var(--text-color), 0.1);
}
:host([variant='primary']) .button{
    background: var(--accent-color);
    color: rgba(var(--background-color), 1);
}
:host([variant='outlined']) .button{
    -webkit-box-shadow: 0 0 0 1px rgba(var(--text-color), 0.2) inset;
            box-shadow: 0 0 0 1px rgba(var(--text-color), 0.2) inset;
    background: transparent; 
    color: var(--accent-color);
}
:host([variant='no-outline']) .button{
    background: inherit; 
    color: var(--accent-color);
}
:host([disabled]){
    pointer-events: none;
    cursor: not-allowed;
}
.button {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    padding: var(--padding);
    cursor: pointer;
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
    border-radius: var(--border-radius); 
    -webkit-box-pack: center; 
        -ms-flex-pack: center; 
            justify-content: center;
    transition: box-shadow 0.3s, background-color 0.3s;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 500;
    background-color: var(--background); 
    -webkit-tap-highlight-color: transparent;
    outline: none;
    overflow: hidden;
    border: none;
    color: inherit;
    align-items: center;
}
:host([disabled]) .button{
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.6;
    color: rgba(var(--text-color), 1);
    background-color: rgba(var(--text-color), 0.3);
}
@media (hover: hover){
    :host(:not([disabled])) .button:hover{
        -webkit-box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.12);
                box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.12);
    }
    :host([variant='outlined']) .button:hover{
        -webkit-box-shadow: 0 0 0 1px rgba(var(--text-color), 0.2) inset, 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.4rem 0.8rem rgba(0, 0, 0, 0.12);
                box-shadow: 0 0 0 1px rgba(var(--text-color), 0.2) inset, 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.4rem 0.8rem rgba(0, 0, 0, 0.12);
    }
}
@media (hover: none){
    :host(:not([disabled])) .button:active{
        -webkit-box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.2);
                box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.2);
    }
    :host([variant='outlined']) .button:active{
        -webkit-box-shadow: 0 0 0 1px rgba(var(--text-color), 0.2) inset, 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.4rem 0.8rem rgba(0, 0, 0, 0.2);
                box-shadow: 0 0 0 1px rgba(var(--text-color), 0.2) inset, 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.4rem 0.8rem rgba(0, 0, 0, 0.2);
    }
}
</style>
<div part="button" class="button">
    <slot></slot>   
</div>`;
customElements.define('sm-button',
    class extends HTMLElement {
        constructor() {
            super()
            this.attachShadow({
                mode: 'open'
            }).append(smButton.content.cloneNode(true))
        }
        static get observedAttributes() {
            return ['disabled'];
        }

        get disabled() {
            return this.hasAttribute('disabled')
        }

        set disabled(value) {
            if (value) {
                this.setAttribute('disabled', '')
            }else {
                this.removeAttribute('disabled')
            }
        }

        handleKeyDown(e) {
            if (!this.hasAttribute('disabled') && (e.key === 'Enter' || e.code === 'Space')) {
                e.preventDefault()
                this.click()
            }
        }

        connectedCallback() {
            if (!this.hasAttribute('disabled')) {
                this.setAttribute('tabindex', '0')
            }
            this.setAttribute('role', 'button')
            this.addEventListener('keydown', this.handleKeyDown)
        }
        attributeChangedCallback(name, oldVal, newVal) {
            if (name === 'disabled') {
                this.removeAttribute('tabindex')
                this.setAttribute('aria-disabled', 'true')
            }
            else {
                this.setAttribute('tabindex', '0')
                this.setAttribute('aria-disabled', 'false')
            }
        }
    })
const smCheckbox = document.createElement('template')
smCheckbox.innerHTML = `
<style>
    *{
        padding: 0;
        margin: 0;
        -webkit-box-sizing: border-box;
                box-sizing: border-box;
    } 
    :host{
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
        --accent-color: #4d2588;
        --text-color: 17, 17, 17;
        --background-color: 255, 255, 255;
        --height: 1.2rem;
        --width: 1.2rem;
        --border-radius: 0.2rem;
        --border-color: rgba(var(--text-color), 0.7);
    }
    :host([disabled]) {
        opacity: 0.6;
        user-select: none;
        pointer-events: none;
    }
    .checkbox {
        position: relative;
        display:-webkit-box;
        display:-ms-flexbox;
        display:flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        cursor: pointer;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }
    
    .checkbox:focus-visible{
        outline: auto;
    }
    .checkbox:active .icon,
    .checkbox:focus-within .icon{
        box-shadow: 0 0 0 0.1rem var(--accent-color) inset;
    }
    
    input {
        display: none;
    }
    
    .checkmark {
        stroke-dashoffset: -65;
        stroke-dasharray: 65;
        -webkit-transition: stroke-dashoffset 0.3s; 
        -o-transition: stroke-dashoffset 0.3s; 
        transition: stroke-dashoffset 0.3s;
    }
    
    :host([checked]) .checkmark {
        stroke-dashoffset: 0;
        stroke: rgba(var(--background-color), 1);
    }
    :host([checked]) .icon {
        background: var(--accent-color);
        box-shadow: 0 0 0 0.1rem var(--accent-color) inset;
    }    
    .icon {
        fill: none;
        height: var(--height);
        width: var(--width);
        padding: 0.1rem;
        stroke-width: 8; 
        stroke: var(--border-color);
        overflow: visible;
        stroke-linecap: round;
        stroke-linejoin: round;
        -webkit-transition: background 0.3s;
        -o-transition: background 0.3s;
        transition: background 0.3s;
        border-radius: var(--border-radius);
        box-shadow: 0 0 0 0.1rem var(--border-color) inset;
    }
</style>
<label class="checkbox">
    <svg class="icon" viewBox="0 0 64 64">
        <title>checkbox</title>
        <path class="checkmark" d="M50.52,19.56,26,44.08,13.48,31.56" />
    </svg>
    <slot></slot>
</label>`
customElements.define('sm-checkbox', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open'
        }).append(smCheckbox.content.cloneNode(true))

        this.checkbox = this.shadowRoot.querySelector('.checkbox');

        this.reset = this.reset.bind(this)
        this.dispatch = this.dispatch.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    static get observedAttributes() {
        return ['value', 'disabled', 'checked']
    }

    get disabled() {
        return this.hasAttribute('disabled')
    }

    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', '')
        } else {
            this.removeAttribute('disabled')
        }
    }

    get checked() {
        return this.hasAttribute('checked')
    }

    set checked(value) {
        if (value) {
            this.setAttribute('checked', '')
        }
        else {
            this.removeAttribute('checked')
        }
    }

    set value(val) {
        this.setAttribute('value', val)
    }

    get value() {
        return this.getAttribute('value')
    }

    reset() {
        this.removeAttribute('checked')
    }

    dispatch(){
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            composed: true
        }))
    }
    handleKeyDown(e){
        if (e.code === "Space") {
            e.preventDefault()
            this.click()
        }
    }
    handleClick(e){
        this.toggleAttribute('checked')
    }
    
    connectedCallback() {
        if (!this.hasAttribute('disabled')) {
            this.setAttribute('tabindex', '0')
        }
        this.setAttribute('role', 'checkbox')
        if (!this.hasAttribute('checked')) {
            this.setAttribute('aria-checked', 'false')
        }
        this.addEventListener('keydown', this.handleKeyDown)
        this.addEventListener('click', this.handleClick)
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'checked') {
                this.setAttribute('aria-checked', this.hasAttribute('checked'))
                this.dispatch()
            }
            else if (name === 'disabled') {
                if (this.hasAttribute('disabled')) {
                    this.removeAttribute('tabindex')
                }
                else {
                    this.setAttribute('tabindex', '0')
                }
            }
        }
    }
    disconnectedCallback() {
        this.removeEventListener('keydown', this.handleKeyDown)
        this.removeEventListener('change', this.handleClick)
    }
})
const smCopy = document.createElement('template')
smCopy.innerHTML = `
<style>     
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
}       
:host{
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    --accent-color: #4d2588;
    --text-color: 17, 17, 17;
    --background-color: 255, 255, 255;
    --padding: 0;
    --background-color: inherit;
    --button-background-color: rgba(var(--text-color), 0.2);
    --button-border-radius: 0.3rem;
}
.copy{
    display: grid;
    gap: 1rem;
    padding: var(--padding);
    align-items: center;
    grid-template-columns: minmax(0, 1fr) auto;
}
.copy-button{
    display: inline-flex;
    justify-content: center;
    cursor: pointer;
    border: none;
    padding: 0.4rem;
    background-color: inherit;
    border-radius: var(--button-border-radius);
}
.copy-button:active{
    background-color: var(--button-background-color);
}
.icon{
    height: 1.2rem;
    width: 1.2rem;
    fill: rgba(var(--text-color), 0.8);
}
@media (any-hover: hover){
    .copy:hover .copy-button{
        opacity: 1;
    }
    .copy-button{
        opacity: 0.6;
    }
    .copy-button:hover{
        background-color: var(--button-background-color);
    }
}
</style>
</style>
<section class="copy">
    <p class="copy-content"></p>
    <button part="button" class="copy-button" title="copy">
        <slot name="copy-icon">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.007-1H7zM5.003 8L5 20h10V8H5.003zM9 6h8v10h2V4H9v2z"/></svg>
        </slot>
    </button>
</section>
`;
customElements.define('sm-copy',
    class extends HTMLElement {
        constructor() {
            super()
            this.attachShadow({
                mode: 'open'
            }).append(smCopy.content.cloneNode(true))
            
            this.copyContent = this.shadowRoot.querySelector('.copy-content')
            this.copyButton = this.shadowRoot.querySelector('.copy-button')

            this.copy = this.copy.bind(this)
        }
        static get observedAttributes() {
            return ['value']
        }
        set value(val) {
            this.setAttribute('value', val)
        }
        get value() {
            return this.getAttribute('value')
        }
        fireEvent() {
            this.dispatchEvent(
                new CustomEvent('copy', {
                    composed: true,
                    bubbles: true,
                    cancelable: true,
                })
            )
        }
        copy() {
            navigator.clipboard.writeText(this.copyContent.textContent)
                .then(res => this.fireEvent())
                .catch(err => console.error(err))
        }
        connectedCallback() {
            this.copyButton.addEventListener('click', this.copy)
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'value') {
                this.copyContent.textContent = newValue
            }
        }
        disconnectedCallback() {
            this.copyButton.removeEventListener('click', this.copy)
        }
    })
const smForm = document.createElement('template')
smForm.innerHTML = `
    <style>
    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    :host{
        display: flex;
        --gap: 1rem;
        width: 100%;
    }
    form{
        display: grid;
        gap: var(--gap);
        width: 100%;
    }
    </style>
	<form onsubmit="return false">
		<slot></slot>
	</form>
`

customElements.define('sm-form', class extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({
			mode: 'open'
		}).append(smForm.content.cloneNode(true))

		this.form = this.shadowRoot.querySelector('form')
		this.formElements
		this.requiredElements
		this.submitButton
		this.resetButton
		this.allRequiredValid = false

		this.debounce = this.debounce.bind(this)
		this.handleInput = this.handleInput.bind(this)
		this.handleKeydown = this.handleKeydown.bind(this)
		this.reset = this.reset.bind(this)
	}
	debounce(callback, wait) {
		let timeoutId = null;
		return (...args) => {
			window.clearTimeout(timeoutId);
			timeoutId = window.setTimeout(() => {
				callback.apply(null, args);
			}, wait);
		};
	}
	handleInput(e) {
		this.allRequiredValid = this.requiredElements.every(elem => elem.isValid)
		if (!this.submitButton) return;
		if (this.allRequiredValid) {
			this.submitButton.disabled = false;
		}
		else {
			this.submitButton.disabled = true;
		}
	}
	handleKeydown(e) {
		if (e.key === 'Enter' && e.target.tagName !== 'SM-TEXTAREA' ) {
			if (this.allRequiredValid) {
				this.submitButton.click()
			}
			else {
			    this.requiredElements.find(elem => !elem.isValid).vibrate()
			}
		}
	}
	reset() {
		this.formElements.forEach(elem => elem.reset())
	}
	connectedCallback() {
		const slot = this.shadowRoot.querySelector('slot')
		slot.addEventListener('slotchange', e => {
			this.formElements = [...this.querySelectorAll('sm-input, sm-textarea, sm-checkbox, tags-input, file-input, sm-switch, sm-radio')]
			this.requiredElements = this.formElements.filter(elem => elem.hasAttribute('required'))
			this.submitButton = e.target.assignedElements().find(elem => elem.getAttribute('variant') === 'primary' || elem.getAttribute('type') === 'submit');
			this.resetButton = e.target.assignedElements().find(elem => elem.getAttribute('type') === 'reset');
			if (this.resetButton) {
				this.resetButton.addEventListener('click', this.reset)
			}
		})
		this.addEventListener('input', this.debounce(this.handleInput, 100))
		this.addEventListener('keydown', this.debounce(this.handleKeydown, 100))
	}
	disconnectedCallback() {
		this.removeEventListener('input', this.debounce(this.handleInput, 100))
		this.removeEventListener('keydown', this.debounce(this.handleKeydown, 100))
	}
})

const smInput = document.createElement('template')
smInput.innerHTML = `
<style>
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
} 
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration { display: none; }
input[type=number] {
-moz-appearance:textfield;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0; 
}
input::-ms-reveal,
input::-ms-clear {
  display: none;
}
input:invalid{
    outline: none;
    -webkit-box-shadow: none;
            box-shadow: none;
}
::-moz-focus-inner{
border: none;
}
:host{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    --accent-color: #4d2588;
    --text-color: 17, 17, 17;
    --background-color: 255, 255, 255;
    --success-color: #00C853;
    --danger-color: red;
    --width: 100%;
    --font-size: 1rem;
    --icon-gap: 0.5rem;
    --border-radius: 0.3rem;
    --padding: 0.7rem 1rem;
    --background: rgba(var(--text-color), 0.06);
}
.hide{
   opacity: 0 !important;
   pointer-events: none !important;
}
.hide-completely{
    display: none;
}
.icon {
    fill: rgba(var(--text-color), 0.6);
    height: 1.4rem;
    width: 1.4rem;
    border-radius: 1rem;
    cursor: pointer;
    min-width: 0;
}

:host(.round) .input{
    border-radius: 10rem;
}
.input {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    cursor: text;
    min-width: 0;
    text-align: left;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    position: relative;
    gap: var(--icon-gap);
    padding: var(--padding);
    border-radius: var(--border-radius);
    -webkit-transition: opacity 0.3s;
    -o-transition: opacity 0.3s;
    transition: opacity 0.3s;
    background: var(--background);
    width: 100%;
    outline: none;
}
.input.readonly .clear{
    opacity: 0 !important;
    margin-right: -2rem;
    pointer-events: none !important;
}
.readonly{
    pointer-events: none;
}
.input:focus-within:not(.readonly){
    box-shadow: 0 0 0 0.1rem var(--accent-color) inset !important;
}
.disabled{
    pointer-events: none;
    opacity: 0.6;
}
.label {
    opacity: .7;
    font-weight: 400;
    font-size: var(--font-size);
    position: absolute;
    top: 0;
    -webkit-transition: -webkit-transform 0.3s;
    transition: -webkit-transform 0.3s;
    -o-transition: transform 0.3s;
    transition: transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
    -webkit-transform-origin: left;
    -ms-transform-origin: left;
        transform-origin: left;
    pointer-events: none;
    white-space: nowrap;
    overflow: hidden;
    -o-text-overflow: ellipsis;
       text-overflow: ellipsis;
    width: 100%;
    user-select: none;
    will-change: transform;
}
.outer-container{
    position: relative;
    width: var(--width);
}
.container{
    width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: relative;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-flex: 1;
        -ms-flex: 1;
            flex: 1;
}    
input{
    font-size: var(--font-size);
    border: none;
    background: transparent;
    outline: none;
    color: rgba(var(--text-color), 1);
    width: 100%;
}
:host(:not([variant="outlined"])) .animate-label .container input {
    -webkit-transform: translateY(0.6rem);
            -ms-transform: translateY(0.6rem);
        transform: translateY(0.6rem);
    }
  
:host(:not([variant="outlined"])) .animate-label .label {
    -webkit-transform: translateY(-0.7em) scale(0.8);
            -ms-transform: translateY(-0.7em) scale(0.8);
        transform: translateY(-0.7em) scale(0.8);
    opacity: 1;
    color: var(--accent-color)
}
:host([variant="outlined"]) .input {
    box-shadow: 0 0 0 0.1rem rgba(var(--text-color), 0.4) inset;
    background: rgba(var(--background-color), 1);
}
:host([variant="outlined"]) .label {
    width: max-content;
    margin-left: -0.5rem;
    padding: 0 0.5rem;
}
:host([variant="outlined"]) .animate-label .label {
    -webkit-transform: translate(0.1rem, -1.5rem) scale(0.8);
            -ms-transform: translate(0.1rem, -1.5rem) scale(0.8);
        transform: translate(0.1rem, -1.5rem) scale(0.8);
    opacity: 1;
    background: rgba(var(--background-color), 1);
}
.animate-label:focus-within:not(.readonly) .label{
    color: var(--accent-color)
}
.feedback-text:not(:empty){
    display: flex;
    width: 100%;
    text-align: left;
    font-size: 0.9rem;
    align-items: center;
    padding: 0.8rem 0;
    color: rgba(var(--text-color), 0.8);
}
.success{
    color: var(--success-color);
}
.error{
    color: var(--danger-color);
}
.status-icon{
    margin-right: 0.2rem;
}
.status-icon--error{
    fill: var(--danger-color);
}
.status-icon--success{
    fill: var(--success-color);
}
@media (any-hover: hover){
    .icon:hover{
        background: rgba(var(--text-color), 0.1);
    }
}
</style>
<div class="outer-container">
    <label part="input" class="input">
        <slot name="icon"></slot>
        <div class="container">
            <input type="text"/>
            <div part="placeholder" class="label"></div>
        </div>
        <svg class="icon clear hide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-11.414L9.172 7.757 7.757 9.172 10.586 12l-2.829 2.828 1.415 1.415L12 13.414l2.828 2.829 1.415-1.415L13.414 12l2.829-2.828-1.415-1.415L12 10.586z"/></svg>
    </label>
    <p class="feedback-text"></p>
</div>
`;
customElements.define('sm-input',
    class extends HTMLElement {

        constructor() {
            super()
            this.attachShadow({
                mode: 'open'
            }).append(smInput.content.cloneNode(true))

            this.inputParent = this.shadowRoot.querySelector('.input')
            this.input = this.shadowRoot.querySelector('input')
            this.clearBtn = this.shadowRoot.querySelector('.clear')
            this.label = this.shadowRoot.querySelector('.label')
            this.feedbackText = this.shadowRoot.querySelector('.feedback-text')
            this.outerContainer = this.shadowRoot.querySelector('.outer-container')
            this._helperText
            this._errorText
            this.isRequired = false
            this.validationFunction
            this.reflectedAttributes = ['value', 'required', 'disabled', 'type', 'inputmode', 'readonly', 'min', 'max', 'pattern', 'minlength', 'maxlength', 'step']
        
            this.reset = this.reset.bind(this)
            this.focusIn = this.focusIn.bind(this)
            this.focusOut = this.focusOut.bind(this)
            this.fireEvent = this.fireEvent.bind(this)
            this.checkInput = this.checkInput.bind(this)
            this.vibrate = this.vibrate.bind(this)
        }

        static get observedAttributes() {
            return ['value', 'placeholder', 'required', 'disabled', 'type', 'inputmode', 'readonly', 'min', 'max', 'pattern', 'minlength', 'maxlength', 'step', 'helper-text', 'error-text']
        }

        get value() {
            return this.input.value
        }

        set value(val) {
            this.input.value = val;
            this.checkInput()
            this.fireEvent()
        }

        get placeholder() {
            return this.getAttribute('placeholder')
        }

        set placeholder(val) {
            this.setAttribute('placeholder', val)
        }

        get type() {
            return this.getAttribute('type')
        }

        set type(val) {
            this.setAttribute('type', val)
        }

        get validity() {
            return this.input.validity
        }

        set disabled(value) {
            if (value)
                this.inputParent.classList.add('disabled')
            else
                this.inputParent.classList.remove('disabled')
        }
        set readOnly(value) {
            if (value) {
                this.setAttribute('readonly', '')
            } else {
                this.removeAttribute('readonly')
            }
        }
        set customValidation(val) {
            
            this.validationFunction = val
        }
        set errorText(val) {
            this._errorText = val
        }
        set helperText(val) {
            this._helperText = val
        }
        get isValid() {
            if (this.input.value !== '') {
                const _isValid = this.input.checkValidity()
                let _customValid = true
                if (this.validationFunction) {
                    _customValid = Boolean(this.validationFunction(this.input.value))
                }
                if (_isValid && _customValid) {
                    this.feedbackText.classList.remove('error')
                    this.feedbackText.classList.add('success')
                    this.feedbackText.textContent = ''
                } else {
                    if (this._errorText) {
                        this.feedbackText.classList.add('error')
                        this.feedbackText.classList.remove('success')
                        this.feedbackText.innerHTML = `
                            <svg class="status-icon status-icon--error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/></svg>
                        ${this._errorText}
                        `
                    }
                }
                return (_isValid && _customValid)
            }
        }
        reset(){
            this.value = ''
        }

        focusIn(){
            this.input.focus()
        }

        focusOut(){
            this.input.blur()
        }

        fireEvent(){
            let event = new Event('input', {
                bubbles: true,
                cancelable: true,
                composed: true
            });
            this.dispatchEvent(event);
        }

        checkInput(e){
            if (!this.hasAttribute('readonly')) {
                if (this.input.value.trim() !== '') {
                    this.clearBtn.classList.remove('hide')
                } else {
                    this.clearBtn.classList.add('hide')
                    if (this.isRequired) {
                        this.feedbackText.textContent = '* required'
                    }
                }
            }
            if (!this.hasAttribute('placeholder') || this.getAttribute('placeholder').trim() === '') return;
            if (this.input.value !== '') {
                if (this.animate)
                    this.inputParent.classList.add('animate-label')
                else
                    this.label.classList.add('hide')
            } else {
                if (this.animate)
                    this.inputParent.classList.remove('animate-label')
                else
                    this.label.classList.remove('hide')
            }
        }
        vibrate() {
            this.outerContainer.animate([
                { transform: 'translateX(-1rem)' },
                { transform: 'translateX(1rem)' },
                { transform: 'translateX(-0.5rem)' },
                { transform: 'translateX(0.5rem)' },
                { transform: 'translateX(0)' },
            ], {
                duration: 300,
                easing: 'ease'
            })
        }


        connectedCallback() {
            this.animate = this.hasAttribute('animate')
            this.setAttribute('role', 'textbox')
            this.input.addEventListener('input', this.checkInput)
            this.clearBtn.addEventListener('click', this.reset)
        }
        
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (this.reflectedAttributes.includes(name)) {
                    if (this.hasAttribute(name)) {
                        this.input.setAttribute(name, this.getAttribute(name) ? this.getAttribute(name) : '')
                    }
                    else {
                        this.input.removeAttribute(name)
                    }
                }
                if (name === 'placeholder') {
                    this.label.textContent = newValue;
                    this.setAttribute('aria-label', newValue);
                }
                else if (this.hasAttribute('value')) {
                    this.checkInput()
                }
                else if (name === 'type') {
                    if (this.hasAttribute('type') && this.getAttribute('type') === 'number') {
                        this.input.setAttribute('inputmode', 'numeric')
                    }
                }
                else if (name === 'helper-text') {
                    this._helperText = this.getAttribute('helper-text')
                }
                else if (name === 'error-text') {
                    this._errorText = this.getAttribute('error-text')
                }
                else if (name === 'required') {
                    this.isRequired = this.hasAttribute('required')
                    if (this.isRequired) {
                        this.feedbackText.textContent = '* required'
                        this.setAttribute('aria-required', 'true')
                    }
                    else {
                        this.feedbackText.textContent = ''
                        this.setAttribute('aria-required', 'false')    
                    }
                }
                else if (name === 'readonly') {
                    if (this.hasAttribute('readonly')) {
                        this.inputParent.classList.add('readonly')
                    } else {
                        this.inputParent.classList.remove('readonly')
                    }
                }
                else if (name === 'disabled') {
                    if (this.hasAttribute('disabled')) {
                        this.inputParent.classList.add('disabled')
                    }
                    else {
                        this.inputParent.classList.remove('disabled')
                    }
                }
            }
        }
        disconnectedCallback() {
            this.input.removeEventListener('input', this.checkInput)
            this.clearBtn.removeEventListener('click', this.reset)
        }
    })
const smMenu = document.createElement('template')
smMenu.innerHTML = `
<style>     
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
}
:host{
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
}
.menu{
    display: -ms-grid;
    display: grid;
    place-items: center;
    height: 2rem;
    width: 2rem;
    outline: none;
}
.icon {
    position: absolute;
    fill: rgba(var(--text-color), 0.7);
    height: 2.4rem;
    width: 2.4rem;
    padding: 0.5rem;
    border-radius: 2rem;
    -webkit-transition: background 0.3s;
    -o-transition: background 0.3s;
    transition: background 0.3s;
}      
.select{
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    cursor: pointer;
    width: 100%;
    -webkit-tap-highlight-color: transparent;
}
.menu:focus .icon,
.focused{
    background: rgba(var(--text-color), 0.1); 
}
:host([align-options="left"]) .options{
    left: 0;
}
:host([align-options="right"]) .options{
    right: 0;
}
.options{
    padding: 0.5rem 0;
    overflow: hidden auto;
    position: absolute;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    min-width: -webkit-max-content;
    min-width: -moz-max-content;
    min-width: max-content;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    background: rgba(var(--background-color), 1);
    border-radius: 0.3rem;
    z-index: 1;
    -webkit-box-shadow: 0 0.5rem 1.5rem -0.5rem rgba(0,0,0,0.3);
            box-shadow: 0 0.5rem 1.5rem -0.5rem rgba(0,0,0,0.3);
    bottom: auto;
}
.hide{
    display: none;
}
@media screen and (max-width: 640px){
    .options{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: auto;
        border-radius: 0.5rem 0.5rem 0 0;
    }
}
@media (hover: hover){
    .menu:hover .icon{
        background: rgba(var(--text-color), 0.1); 
    }
}
</style>
<div class="select">
    <div class="menu" tabindex="0">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
    </div>
    <div class="options hide">
        <slot></slot> 
    </div>
</div>`;
customElements.define('sm-menu', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open'
        }).append(smMenu.content.cloneNode(true))

        this.isOpen = false;
        this.availableOptions
        this.containerDimensions
        this.animOptions = {
            duration: 200,
            easing: 'ease'
        }

        this.optionList = this.shadowRoot.querySelector('.options')
        this.menu = this.shadowRoot.querySelector('.menu')
        this.icon = this.shadowRoot.querySelector('.icon')

        this.expand = this.expand.bind(this)
        this.collapse = this.collapse.bind(this)
        this.toggle = this.toggle.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleClickoutSide = this.handleClickoutSide.bind(this)

    }
    static get observedAttributes() {
        return ['value']
    }
    get value() {
        return this.getAttribute('value')
    }
    set value(val) {
        this.setAttribute('value', val)
    }
    expand() {
        if (!this.isOpen) {
            this.optionList.classList.remove('hide')
            this.optionList.animate([
                {
                    transform: window.innerWidth < 640 ? 'translateY(1.5rem)' : 'translateY(-1rem)',
                    opacity: '0'
                },
                {
                    transform: 'none',
                    opacity: '1'
                },
            ], this.animOptions)
                .onfinish = () => {
                    this.isOpen = true
                    this.icon.classList.add('focused')
                }
        }
    }
    collapse() {
        if (this.isOpen) {
            this.optionList.animate([
                {
                    transform: 'none',
                    opacity: '1'
                },
                {
                    transform: window.innerWidth < 640 ? 'translateY(1.5rem)' : 'translateY(-1rem)',
                    opacity: '0'
                },
            ], this.animOptions)
                .onfinish = () => {
                    this.isOpen = false
                    this.icon.classList.remove('focused')
                    this.optionList.classList.add('hide')
                }
        }
    }
    toggle() {
        if (!this.isOpen) {
            this.expand()
        } else {
            this.collapse()
        }
    }
    handleKeyDown(e) {
        // If key is pressed on menu button
        if (e.target === this) {
            if (e.code === 'ArrowDown') {
                e.preventDefault()
                this.availableOptions[0].focus()
            }
            else if (e.code === 'Enter' || e.code === 'Space') {
                e.preventDefault()
                this.toggle()
            }
        } else { // If mey is pressed over menu options
            if (e.code === 'ArrowUp') {
                e.preventDefault()
                if (document.activeElement.previousElementSibling) {
                    document.activeElement.previousElementSibling.focus()
                } else {
                    this.availableOptions[this.availableOptions.length - 1].focus()
                }
            }
            else if (e.code === 'ArrowDown') {
                e.preventDefault()
                if (document.activeElement.nextElementSibling) {
                    document.activeElement.nextElementSibling.focus()
                } else {
                    this.availableOptions[0].focus()
                }
            }
            else if (e.code === 'Enter' || e.code === 'Space') {
                e.preventDefault()
                e.target.click()
            }
        }
    }
    handleClickoutSide(e) {
        if (!this.contains(e.target) && e.button !== 2) {
            this.collapse()
        }
    }
    connectedCallback() {
        this.setAttribute('role', 'listbox')
        this.setAttribute('aria-label', 'dropdown menu')
        const slot = this.shadowRoot.querySelector('.options slot')
        slot.addEventListener('slotchange', e => {
            this.availableOptions = e.target.assignedElements()
            this.containerDimensions = this.optionList.getBoundingClientRect()
        });
        this.addEventListener('click', this.toggle)
        this.addEventListener('keydown', this.handleKeyDown)
        document.addEventListener('mousedown', this.handleClickoutSide)
    }
    disconnectedCallback() {
        this.removeEventListener('click', this.toggle)
        this.removeEventListener('keydown', this.handleKeyDown)
        document.removeEventListener('mousedown', this.handleClickoutSide)
    }
})

// option
const menuOption = document.createElement('template')
menuOption.innerHTML = `
<style>     
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
}     
:host{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    --padding: 0.6rem 1.6rem;
}
.option{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    min-width: 100%;
    padding: var(--padding);
    cursor: pointer;
    overflow-wrap: break-word;
    white-space: nowrap;
    outline: none;
    font-size: 1rem;
    user-select: none;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
}
:host(:focus){
    outline: none;
    background: rgba(var(--text-color), 0.1);
}
@media (any-hover: hover){
    :host{
        --padding: 0.8rem 1.6rem;
    }
    .option:hover{
        background: rgba(var(--text-color), 0.1);
    }
}
</style>
<div class="option">
    <slot></slot> 
</div>`;
customElements.define('menu-option', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open'
        }).append(menuOption.content.cloneNode(true))
    }

    connectedCallback() {
        this.setAttribute('role', 'option')
        this.addEventListener('keyup', e => {
            if (e.code === 'Enter' || e.code === 'Space') {
                e.preventDefault()
                this.click()
            }
        })
    }
})
const smPopup = document.createElement('template')
smPopup.innerHTML = `
<style>
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
} 
:host{
    position: fixed;
    display: -ms-grid;
    display: grid;
    z-index: 10;
    --accent-color: #4d2588;
    --text-color: 17, 17, 17;
    --background-color: 255, 255, 255;
    --width: 100%;
    --height: auto;
    --min-width: auto;
    --min-height: auto;
    --body-padding: 1.5rem;
    --backdrop-background: rgba(0, 0, 0, 0.6);
    --border-radius: 0.8rem 0.8rem 0 0;
}
.popup-container{
    display: -ms-grid;
    display: grid;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    place-items: center;
    background: var(--backdrop-background);
    -webkit-transition: opacity 0.3s;
    -o-transition: opacity 0.3s;
    transition: opacity 0.3s;
    z-index: 10;
    touch-action: none;
}
:host(.stacked) .popup{
    -webkit-transform: scale(0.9) translateY(-2rem) !important;
            transform: scale(0.9) translateY(-2rem) !important;
}
.popup{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
            flex-direction: column;
    position: relative;
    -ms-flex-item-align: end;
        align-self: flex-end;
    -webkit-box-align: start;
        -ms-flex-align: start;
            align-items: flex-start;
    width: var(--width);
    min-width: var(--min-width);
    height: var(--height);
    min-height: var(--min-height);
    max-height: 90vh;
    border-radius: var(--border-radius);
    -webkit-transform: scale(1) translateY(100%);
            transform: scale(1) translateY(100%);
    -webkit-transition: -webkit-transform 0.3s;
    transition: -webkit-transform 0.3s;
    -o-transition: transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
    transition: transform 0.3s;
    background: rgba(var(--background-color), 1);
    -webkit-box-shadow: 0 -1rem 2rem #00000020;
            box-shadow: 0 -1rem 2rem #00000020;
    content-visibility: auto;
}
.container-header{
    display: -webkit-box;
    display: flex;
    width: 100%;
    touch-action: none;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
}
.popup-top{
    display: -webkit-box;
    display: flex;
    width: 100%;
}
.popup-body{
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    -webkit-box-flex: 1;
        -ms-flex: 1;
            flex: 1;
    width: 100%;
    padding: var(--body-padding);
    overflow-y: auto;
}
.hide{
    opacity: 0;
    pointer-events: none;
    visiblity: none;
}
@media screen and (min-width: 640px){
    :host{
        --border-radius: 0.4rem;
    }
    .popup{
        -ms-flex-item-align: center;
            -ms-grid-row-align: center;
            align-self: center;
        border-radius: var(--border-radius);
        height: var(--height);
        -webkit-transform: scale(1) translateY(3rem);
                transform: scale(1) translateY(3rem);
        -webkit-box-shadow: 0 3rem 2rem -0.5rem #00000040;
                box-shadow: 0 3rem 2rem -0.5rem #00000040;
    }
}
@media screen and (max-width: 640px){
    .popup-top{
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
                flex-direction: column;
        -webkit-box-align: center;
                align-items: center;
    }
    .handle{
        height: 0.3rem;
        width: 2rem;
        background: rgba(var(--text-color), .4);
        border-radius: 1rem;
        margin: 0.5rem 0;
    }
}
@media (any-hover: hover){
    ::-webkit-scrollbar{
        width: 0.5rem;
    }
    
    ::-webkit-scrollbar-thumb{
        background: rgba(var(--text-color), 0.3);
        border-radius: 1rem;
        &:hover{
            background: rgba(var(--text-color), 0.5);
        }
    }
}
</style>
<div part="background" class="popup-container hide" role="dialog">
    <div part="popup" class="popup">
        <div part="popup-header" class="popup-top">
            <div class="handle"></div>
            <slot name="header"></slot>
        </div>
        <div part="popup-body" class="popup-body">
            <slot></slot>
        </div>
    </div>
</div>
`;
customElements.define('sm-popup', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open'
        }).append(smPopup.content.cloneNode(true))

        this.allowClosing = false
        this.isOpen = false
        this.pinned = false
        this.popupStack
        this.offset
        this.touchStartY = 0
        this.touchEndY = 0
        this.touchStartTime = 0
        this.touchEndTime = 0
        this.touchEndAnimataion

        this.popupContainer = this.shadowRoot.querySelector('.popup-container')
        this.popup = this.shadowRoot.querySelector('.popup')
        this.popupBodySlot = this.shadowRoot.querySelector('.popup-body slot')
        this.popupHeader = this.shadowRoot.querySelector('.popup-top')

        this.resumeScrolling = this.resumeScrolling.bind(this)
        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)
        this.handleTouchStart = this.handleTouchStart.bind(this)
        this.handleTouchMove = this.handleTouchMove.bind(this)
        this.handleTouchEnd = this.handleTouchEnd.bind(this)
        this.movePopup = this.movePopup.bind(this)
    }

    static get observedAttributes() {
        return ['open'];
    }

    get open() {
        return this.isOpen
    }

    resumeScrolling() {
        const scrollY = document.body.style.top;
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
        setTimeout(() => {
            document.body.style.overflow = 'auto';
            document.body.style.top = 'initial'
        }, 300);
    }

    show(options = {}) {
        const {pinned = false, popupStack = undefined} = options
        if (popupStack)
            this.popupStack = popupStack
        if (this.popupStack && !this.hasAttribute('open')) {
            this.popupStack.push({
                popup: this,
                permission: pinned
            })
            if (this.popupStack.items.length > 1) {
                this.popupStack.items[this.popupStack.items.length - 2].popup.classList.add('stacked')
            }
            this.dispatchEvent(
                new CustomEvent("popupopened", {
                    bubbles: true,
                    detail: {
                        popup: this,
                        popupStack: this.popupStack
                    }
                })
            )
            this.setAttribute('open', '')
            this.pinned = pinned
            this.isOpen = true
        }
        this.popupContainer.classList.remove('hide')
        this.popup.style.transform = 'none';
        document.body.style.overflow = 'hidden';
        document.body.style.top = `-${window.scrollY}px`
        return this.popupStack
    }
    hide() {
        if (window.innerWidth < 640)
            this.popup.style.transform = 'translateY(100%)';
        else
            this.popup.style.transform = 'translateY(3rem)';
        this.popupContainer.classList.add('hide')
        this.removeAttribute('open')
        if (typeof this.popupStack !== 'undefined') {
            this.popupStack.pop()
            if (this.popupStack.items.length) {
                this.popupStack.items[this.popupStack.items.length - 1].popup.classList.remove('stacked')
            } else {
                this.resumeScrolling()
            }
        } else {
            this.resumeScrolling()
        }

        if (this.forms.length) {
            setTimeout(() => {
                this.forms.forEach(form => form.reset())
            }, 300);
        }
        setTimeout(() => {
            this.dispatchEvent(
                new CustomEvent("popupclosed", {
                    bubbles: true,
                    detail: {
                        popup: this,
                        popupStack: this.popupStack
                    }
                })
            )
            this.isOpen = false
        }, 300);
    }

    handleTouchStart(e) {
        this.touchStartY = e.changedTouches[0].clientY
        this.popup.style.transition = 'transform 0.1s'
        this.touchStartTime = e.timeStamp
    }

    handleTouchMove(e) {
        if (this.touchStartY < e.changedTouches[0].clientY) {
            this.offset = e.changedTouches[0].clientY - this.touchStartY;
            this.touchEndAnimataion = window.requestAnimationFrame(() => this.movePopup())
        }
    }

    handleTouchEnd(e) {
        this.touchEndTime = e.timeStamp
        cancelAnimationFrame(this.touchEndAnimataion)
        this.touchEndY = e.changedTouches[0].clientY
        this.popup.style.transition = 'transform 0.3s'
        this.threshold = this.popup.getBoundingClientRect().height * 0.3
        if (this.touchEndTime - this.touchStartTime > 200) {
            if (this.touchEndY - this.touchStartY > this.threshold) {
                if (this.pinned) {
                    this.show()
                    return
                } else
                    this.hide()
            } else {
                this.show()
            }
        } else {
            if (this.touchEndY > this.touchStartY)
                if (this.pinned) {
                    this.show()
                    return
                }
                else
                    this.hide()
        }
    }

    movePopup() {
        this.popup.style.transform = `translateY(${this.offset}px)`
    }

    connectedCallback() {
        this.popupBodySlot.addEventListener('slotchange', () => {
            this.forms = this.querySelectorAll('sm-form')
        })
        this.popupContainer.addEventListener('mousedown', e => {
            if (e.target === this.popupContainer && !this.pinned) {
                if (this.pinned) {
                    this.show()
                } else
                    this.hide()
            }
        })

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentBoxSize) {
                    // Firefox implements `contentBoxSize` as a single content rect, rather than an array
                    const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
                    this.threshold = contentBoxSize.blockSize.height * 0.3
                } else {
                    this.threshold = entry.contentRect.height * 0.3
                }
            }
        });
        resizeObserver.observe(this)
        
        
        this.popupHeader.addEventListener('touchstart', (e) => { this.handleTouchStart(e) }, { passive: true })
        this.popupHeader.addEventListener('touchmove', (e) => { this.handleTouchMove(e) }, { passive: true })
        this.popupHeader.addEventListener('touchend', (e) => { this.handleTouchEnd(e) }, { passive: true })
    }
    disconnectedCallback() {
        this.popupHeader.removeEventListener('touchstart', this.handleTouchStart, { passive: true })
        this.popupHeader.removeEventListener('touchmove', this.handleTouchMove, { passive: true })
        this.popupHeader.removeEventListener('touchend', this.handleTouchEnd, { passive: true })
        resizeObserver.unobserve()
    }
    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'open') {
            if (this.hasAttribute('open')) {
                this.show()
            }
        }
    }
})

const smSwitch = document.createElement('template')
smSwitch.innerHTML = `	
<style>
    *{
        -webkit-box-sizing: border-box;
                box-sizing: border-box;
        padding: 0;
        margin: 0;
    }
    
    :host{
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
        --accent-color: #4d2588;
        --text-color: 17, 17, 17;
        --background-color: 255, 255, 255;
    }
    label{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        width: 100%;
        outline: none;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
    }
    :host(:not([disabled])) label:focus-visible{
        -webkit-box-shadow: 0 0 0 0.1rem var(--accent-color);
            box-shadow: 0 0 0 0.1rem var(--accent-color);
    }
    :host([disabled]) {
        cursor: not-allowed;
        opacity: 0.6;
        pointer-events: none;
    }
    .switch {
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        width: 2.4rem;
        flex-shrink: 0;
        margin-left: auto;
        padding: 0.2rem;
        cursor: pointer;
        border-radius: 2rem;
    }
    
    input {
        display: none;
    }
    
    .track {
        position: absolute;
        left: 0;
        right: 0;
        height: 1.4rem;
        -webkit-transition: background 0.3s;
        -o-transition: background 0.3s;
        transition: background 0.3s;
        background: rgba(var(--text-color), 0.4);
        -webkit-box-shadow: 0 0.1rem 0.3rem #00000040 inset;
                box-shadow: 0 0.1rem 0.3rem #00000040 inset;
        border-radius: 1rem;
    }
    
    .switch:active .button::after,
    .switch:focus .button::after{
        opacity: 1
    }
    .switch:focus-visible .button::after{
        opacity: 1
    }
    
    .button::after{
        content: '';
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        position: absolute;
        height: 2.6rem;
        width: 2.6rem;
        background: rgba(var(--text-color), 0.2);
        border-radius: 2rem;
        opacity: 0;
        -webkit-transition: opacity 0.3s;
        -o-transition: opacity 0.3s;
        transition: opacity 0.3s;
    }
    
    .button {
        position: relative;
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
        height: 1rem;
        width: 1rem;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        border-radius: 1rem;
        -webkit-box-shadow: 0 0.1rem 0.4rem #00000060;
                box-shadow: 0 0.1rem 0.4rem #00000060;
        -webkit-transition: -webkit-transform 0.3s;
        transition: -webkit-transform 0.3s;
        -o-transition: transform 0.3s;
        transition: transform 0.3s;
        transition: transform 0.3s, -webkit-transform 0.3s;
        border: solid 0.3rem white;
    }
    
    input:checked ~ .button {
        -webkit-transform: translateX(100%);
            -ms-transform: translateX(100%);
                transform: translateX(100%);
    }
    
    input:checked ~ .track {
        background: var(--accent-color);
    }
</style>
<label tabindex="0">
    <slot name="left"></slot>
    <div part="switch" class="switch">
        <input type="checkbox">
        <div class="track"></div>
        <div class="button"></div>
    </div>
    <slot name="right"></slot>
</label>`

customElements.define('sm-switch', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open'
        }).append(smSwitch.content.cloneNode(true))
        this.switch = this.shadowRoot.querySelector('.switch');
        this.input = this.shadowRoot.querySelector('input')
        this.isChecked = false
        this.isDisabled = false

        this.dispatch = this.dispatch.bind(this)
    }

    static get observedAttributes() {
        return ['disabled', 'checked']
    }

    get disabled() {
        return this.isDisabled
    }

    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', '')
        } else {
            this.removeAttribute('disabled')
        }
    }

    get checked() {
        return this.isChecked
    }

    set checked(value) {
        if (value) {
            this.setAttribute('checked', '')
        } else {
            this.removeAttribute('checked')
        }
    }

    dispatch(){
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: {
                value: this.isChecked 
            }
        }))
    }

    connectedCallback() {
        this.addEventListener('keydown', e => {
            if (e.code === "Space" && !this.isDisabled) {
                e.preventDefault()
                this.input.click()
            }
        })
        this.input.addEventListener('click', e => {
            if (this.input.checked)
                this.checked = true
            else
                this.checked = false
            this.dispatch()
        })
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'disabled') {
                if (this.hasAttribute('disabled')) {
                    this.disabled = true                
                }
                else {
                    this.disabled = false                
                }
            }
            else if (name === 'checked') {
                if (this.hasAttribute('checked')) {
                    this.isChecked = true
                    this.input.checked = true            
                }
                else {
                    this.isChecked = false
                    this.input.checked = false               
                } 
            }
        }
    }

})
const spinner = document.createElement('template')
spinner.innerHTML = `
<style>     
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
}
:host{
    --accent-color: #4d2588;
}
.loader {
    height: 1.6rem;
    width: 1.6rem;
    stroke-width: 8;
    overflow: visible;
    stroke: var(--accent-color);
    fill: none;
    stroke-dashoffset: 180;
    stroke-dasharray: 180;
    animation: load 2s infinite, spin 1s linear infinite;
}
@keyframes load {
    50% {
        stroke-dashoffset: 0;
    }
    100%{
        stroke-dashoffset: -180;
    }
}

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}
</style>
<svg viewBox="0 0 64 64" class="loader"><circle cx="32" cy="32" r="32" /></svg>

`
class SquareLoader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        }).append(spinner.content.cloneNode(true))
    }
}

window.customElements.define('sm-spinner', SquareLoader);
const smTabHeader = document.createElement('template')
smTabHeader.innerHTML = `
<style>
    *{
        padding: 0;
        margin: 0;
        -webkit-box-sizing: border-box;
                box-sizing: border-box;
    } 
    :host{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        --accent-color: #4d2588;
        --text-color: 17, 17, 17;
        --background-color: 255, 255, 255;
        --tab-indicator-border-radius: 0.3rem;
    }
    .tabs{
        position: relative;
        display: -ms-grid;
        display: grid;
        width: 100%;
    }
    .tab-header{
        display: -ms-grid;
        display: grid;
        grid-auto-flow: column;
        -webkit-box-pack: start;
            -ms-flex-pack: start;
                justify-content: flex-start;
        gap: 1rem;
        position: relative;
        overflow: auto hidden;
        max-width: 100%;
        scrollbar-width: 0;
    }
    .indicator{
        position: absolute;
        left: 0;
        bottom: 0;
        height: 0.15rem;
        border-radius: 1rem 1rem 0 0;  
        background: var(--accent-color);
        -webkit-transition: width 0.3s, -webkit-transform 0.3s;
        transition: width 0.3s, -webkit-transform 0.3s;
        -o-transition: transform 0.3s, width 0.3s;
        transition: transform 0.3s, width 0.3s;
        transition: transform 0.3s, width 0.3s, -webkit-transform 0.3s;
        pointer-events: none;
    }
    :host([variant="tab"]) .indicator{
        height: 100%;
        border-radius: var(--tab-indicator-border-radius);
    }
    :host([variant="tab"]) .tab-header{
        border-bottom: none; 
    }
    .hide-completely{
        display: none;
    }
    :host([variant="tab"]) .tab-header{
        gap: 0.2rem;
        display: -ms-inline-grid;
        display: inline-grid;
        justify-self: flex-start;
        border-radius: 0.3rem;
    }
    :host([variant="tab"]) slot::slotted(.active){
        color: rgba(var(--background-color), 1);
    }
    slot::slotted(.active){
        color: var(--accent-color);
        opacity: 1;
    }
    @media (hover: none){
        .tab-header::-webkit-scrollbar-track {
            -webkit-box-shadow: none !important;
            background-color: transparent !important;
        }
        .tab-header::-webkit-scrollbar {
            height: 0;
            background-color: transparent;
        }
    }         
</style>
<div part="tab-container" class="tabs">
    <div part="tab-header" class="tab-header">
        <slot></slot>
        <div part="indicator" class="indicator"></div>
    </div>
</div>
`;

customElements.define('sm-tab-header', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open'
        }).append(smTabHeader.content.cloneNode(true))

        this.prevTab
        this.allTabs
        this.activeTab

        this.indicator = this.shadowRoot.querySelector('.indicator');
        this.tabSlot = this.shadowRoot.querySelector('slot');
        this.tabHeader = this.shadowRoot.querySelector('.tab-header');

        this.changeTab = this.changeTab.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handlePanelChange = this.handlePanelChange.bind(this)
    }

    fireEvent(index) {
        this.dispatchEvent(
            new CustomEvent(`switchedtab${this.target}`, {
                bubbles: true,
                detail: {
                    index: parseInt(index)
                }
            })
        )
    }

    moveIndiactor(tabDimensions) {
        this.indicator.setAttribute('style', `width: ${tabDimensions.width}px; transform: translateX(${tabDimensions.left - this.tabHeader.getBoundingClientRect().left + this.tabHeader.scrollLeft}px)`)
    }


    changeTab(target) {
        if (target === this.prevTab || !target.closest('sm-tab'))
            return
        if (this.prevTab)
            this.prevTab.classList.remove('active')
        target.classList.add('active')

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        })
        this.moveIndiactor(target.getBoundingClientRect())
        this.prevTab = target;
        this.activeTab = target;
    }
    handleClick(e) {
        if (e.target.closest('sm-tab')) {
            this.changeTab(e.target)
            this.fireEvent(e.target.dataset.index)
        }
    }
    
    handlePanelChange(e) {
        this.changeTab(this.allTabs[e.detail.index])
    }

    connectedCallback() {
        if (!this.hasAttribute('target') || this.getAttribute('target').value === '') return;
        this.target = this.getAttribute('target')

        this.tabSlot.addEventListener('slotchange', () => {
            this.allTabs = this.tabSlot.assignedElements();
            this.allTabs.forEach((tab, index) => {
                tab.dataset.index = index
            })
        })

        this.addEventListener('click', this.handleClick)
        document.addEventListener(`switchedpanel${this.target}`, this.handlePanelChange)

        let resizeObserver = new ResizeObserver(entries => {
            entries.forEach((entry) => {
                if (this.prevTab) {
                    let tabDimensions = this.activeTab.getBoundingClientRect();
                    this.moveIndiactor(tabDimensions)
                }
            })
        })
        resizeObserver.observe(this)
        let observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.indicator.style.transition = 'none'
                    if (this.activeTab) {
                        let tabDimensions = this.activeTab.getBoundingClientRect();
                        this.moveIndiactor(tabDimensions)
                    } else {
                        this.allTabs[0].classList.add('active')
                        let tabDimensions = this.allTabs[0].getBoundingClientRect();
                        this.moveIndiactor(tabDimensions)
                        this.fireEvent(0)
                        this.prevTab = this.tabSlot.assignedElements()[0];
                        this.activeTab = this.prevTab;
                    }
                }
            })
        }, {
            threshold: 1.0
        })
        observer.observe(this)
    }
    disconnectedCallback() {
        this.removeEventListener('click', this.handleClick)
        document.removeEventListener(`switchedpanel${this.target}`, this.handlePanelChange)
    }
})

// tab
const smTab = document.createElement('template')
smTab.innerHTML = `
<style>
    *{
        padding: 0;
        margin: 0;
        -webkit-box-sizing: border-box;
                box-sizing: border-box;
    } 
    :host{
        position: relative;
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
        z-index: 1;
    }
    .tab{
        position: relative;
        -webkit-user-select: none;
        -moz-user-select: none;
            -ms-user-select: none;
                user-select: none;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        white-space: nowrap;
        padding: 0.4rem 0.8rem;
        font-weight: 500;
        word-spacing: 0.1rem;
        text-align: center;
        -webkit-transition: color 0.3s;
        -o-transition: color 0.3s;
        transition: color 0.3s;
        text-transform: capitalize;
        height: 100%;
    }
    @media (hover: hover){
        :host(.active) .tab{
            opacity: 1;
        }
        .tab{
            opacity: 0.7
        }
        .tab:hover{
            opacity: 1
        }
    }
</style>
<div part="tab" class="tab">
<slot></slot>
</div>
`;

customElements.define('sm-tab', class extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({
            mode: 'open'
        }).append(smTab.content.cloneNode(true))
    }
})

// tab-panels

const smTabPanels = document.createElement('template')
smTabPanels.innerHTML = `
<style>
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
} 
:host{
    width: 100%;
}
.panel-container{
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    scroll-snap-type: x mandatory;
    content-visibility: auto;
}
::slotted(*){
    min-width: 100%;
    scroll-snap-align: center;
}
@media (any-hover: none) {
    .panel-container{
        overflow-x: auto;
        scrollbar-width: none;
    }
    .container {
        overflow-y: scroll;
    }
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
}
</style>
<div part="panel-container" class="panel-container">
    <slot>Nothing to see here.</slot>
</div>
`;

customElements.define('sm-tab-panels', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open'
        }).append(smTabPanels.content.cloneNode(true))

        this.isTransitioning = false

        this.panelContainer = this.shadowRoot.querySelector('.panel-container');
        this.handleTabChange = this.handleTabChange.bind(this)
    }
    handleTabChange(e) {
        this.isTransitioning = true
        this.panelContainer.scrollTo({
            left: this.allPanels[e.detail.index].getBoundingClientRect().left - this.panelContainer.getBoundingClientRect().left + this.panelContainer.scrollLeft,
            behavior: 'smooth'
        })
        setTimeout(() => {
            this.isTransitioning = false
        }, 300);
    }
    fireEvent(index) {
        this.dispatchEvent(
            new CustomEvent(`switchedpanel${this.id}`, {
                bubbles: true,
                detail: {
                    index: parseInt(index)
                }
            })
        )
    }
    connectedCallback() {
        const slot = this.shadowRoot.querySelector('slot');
        slot.addEventListener('slotchange', (e) => {
            this.allPanels = e.target.assignedElements()
            this.allPanels.forEach((panel, index) => {
                panel.dataset.index = index
                intersectionObserver.observe(panel)
            })
        })
        document.addEventListener(`switchedtab${this.id}`, this.handleTabChange)

        const intersectionObserver = new IntersectionObserver(entries => {

            entries.forEach(entry => {
                if (!this.isTransitioning && entry.isIntersecting) {
                    this.fireEvent(entry.target.dataset.index)
                }
            })
        }, {
            threshold: 0.6
        })
    }
    disconnectedCallback() {
        intersectionObserver.disconnect()
        document.removeEventListener(`switchedtab${this.id}`, this.handleTabChange)
    }
})

const themeToggle = document.createElement('template')
themeToggle.innerHTML = `
    <style>
    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    :host{
        cursor: pointer;
        --height: 2.5rem;
        --width: 2.5rem;
    }
    .theme-toggle {
        display: flex;
        position: relative;
        width: 1.4rem;
        height: 1.4rem;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
    }
    .theme-toggle::after{
        content: '';
        position: absolute;
        height: var(--height);
        width: var(--width);
        top: 50%;
        left: 50%;
        opacity: 0;
        border-radius: 50%;
        pointer-events: none;
        transition: transform 0.3s, opacity 0.3s;
        transform: translate(-50%, -50%) scale(1.2);
        background-color: rgba(var(--text-color), 0.12);
    }
    :host(:focus-within) .theme-toggle{
        outline: none;
    }
    :host(:focus-within) .theme-toggle::after{
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    .icon {
        position: absolute;
        height: 100%;
        width: 100%;
        fill: rgba(var(--text-color), 1);
        transition: transform 0.6s;
    }
    
    .theme-switcher__checkbox {
        display: none;
    }
    :host([checked]) .moon-icon {
        transform: scale(0) rotate(90deg);
    }
    :host(:not([checked])) .sun-icon {
        transform: scale(0) rotate(-90deg);
    }
    </style>
    <label class="theme-toggle" title="Change theme" tabindex="0">
        <slot name="light-mode-icon">
            <svg class="icon moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24"
                height="24">
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                    d="M10 6a8 8 0 0 0 11.955 6.956C21.474 18.03 17.2 22 12 22 6.477 22 2 17.523 2 12c0-5.2 3.97-9.474 9.044-9.955A7.963 7.963 0 0 0 10 6zm-6 6a8 8 0 0 0 8 8 8.006 8.006 0 0 0 6.957-4.045c-.316.03-.636.045-.957.045-5.523 0-10-4.477-10-10 0-.321.015-.64.045-.957A8.006 8.006 0 0 0 4 12zm14.164-9.709L19 2.5v1l-.836.209a2 2 0 0 0-1.455 1.455L16.5 6h-1l-.209-.836a2 2 0 0 0-1.455-1.455L13 3.5v-1l.836-.209A2 2 0 0 0 15.29.836L15.5 0h1l.209.836a2 2 0 0 0 1.455 1.455zm5 5L24 7.5v1l-.836.209a2 2 0 0 0-1.455 1.455L21.5 11h-1l-.209-.836a2 2 0 0 0-1.455-1.455L18 8.5v-1l.836-.209a2 2 0 0 0 1.455-1.455L20.5 5h1l.209.836a2 2 0 0 0 1.455 1.455z" />
            </svg>
        </slot>
        <slot name="dark-mode-icon">
            <svg class="icon sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
            </svg>
        </slot>
    </label>
`

class ThemeToggle extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        }).append(themeToggle.content.cloneNode(true))

        this.isChecked = false
        this.hasTheme = 'light'

        this.toggleState = this.toggleState.bind(this)
        this.fireEvent = this.fireEvent.bind(this)
        this.handleThemeChange = this.handleThemeChange.bind(this)
    }
    static get observedAttributes() {
        return ['checked'];
    }

    daylight() {
        this.hasTheme = 'light'
        document.body.dataset.theme = 'light'
        this.setAttribute('aria-checked', 'false')
    }
    
    nightlight() {
        this.hasTheme = 'dark'
        document.body.dataset.theme = 'dark'
        this.setAttribute('aria-checked', 'true')
    }

    toggleState() {
        this.toggleAttribute('checked')
        this.fireEvent()
    }
    handleKeyDown(e) {
        if (e.code === 'Space') {
            this.toggleState()
        }
    }
    handleThemeChange(e) {
        if (e.detail.theme !== this.hasTheme) {
            if (e.detail.theme === 'dark') {
                this.setAttribute('checked', '')
            }
            else {
                this.removeAttribute('checked')   
            }
        }
    }

    fireEvent() {
        this.dispatchEvent(
            new CustomEvent('themechange', {
                bubbles: true,
                composed: true,
                detail: {
                    theme: this.hasTheme
                }
            })
        )
    }

    connectedCallback() {
        this.setAttribute('role', 'switch')
        this.setAttribute('aria-label', 'theme toggle')
        if (localStorage.getItem(`${window.location.hostname}-theme`) === "dark") {
            this.nightlight();
            this.setAttribute('checked', '')
        } else if (localStorage.getItem(`${window.location.hostname}-theme`) === "light") {
            this.daylight();
            this.removeAttribute('checked')
        }
        else {
            if (window.matchMedia(`(prefers-color-scheme: dark)`).matches) {
                this.nightlight();
                this.setAttribute('checked', '')
            } else {
                this.daylight();
                this.removeAttribute('checked')
            }
        }
        this.addEventListener("click", this.toggleState);
        this.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener('themechange', this.handleThemeChange)
    }
    
    disconnectedCallback() {
        this.removeEventListener("click", this.toggleState);
        this.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener('themechange', this.handleThemeChange)
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'checked') {
            if (this.hasAttribute('checked')) {
                this.nightlight();
                localStorage.setItem(`${window.location.hostname}-theme`, "dark");
            } else {
                this.daylight();
                localStorage.setItem(`${window.location.hostname}-theme`, "light");
            }
        }
    }
}

window.customElements.define('theme-toggle', ThemeToggle);

const smTextarea = document.createElement('template')
smTextarea.innerHTML = `
<style>
*,
*::before,
*::after { 
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
} 
::-moz-focus-inner{
    border: none;
}
.hide{
    opacity: 0 !important;
}
:host{
    display: grid;
    --accent-color: #4d2588;
    --text-color: 17, 17, 17;
    --background-color: 255, 255, 255;
    --danger-color: red;
    --border-radius: 0.3rem;
    --background: rgba(var(--text-color), 0.06);
    --padding: initial;
    --max-height: 8rem;
}
:host([variant="outlined"]) .textarea {
    box-shadow: 0 0 0 0.1rem rgba(var(--text-color), 0.4) inset;
    background: rgba(var(--background-color), 1);
}
.textarea{
    display: grid;
    position: relative;
    cursor: text;
    min-width: 0;
    text-align: left;
    overflow: hidden auto;
    grid-template-columns: 1fr;
    align-items: stretch;
    max-height: var(--max-height);
    background: var(--background);
    border-radius: var(--border-radius);
    padding: var(--padding);
}
.textarea::after,
textarea{
    padding: 0.7rem 1rem;
    width: 100%;
    min-width: 1em;
    font: inherit;
    color: inherit;
    resize: none;
    grid-area: 2/1;
    justify-self: stretch;
    background: none;
    appearance: none;
    border: none;
    outline: none;
    line-height: 1.5;
    overflow: hidden;
}
.textarea::after{
    content: attr(data-value) ' ';
    visibility: hidden;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}
.readonly{
    pointer-events: none;
}
.textarea:focus-within:not(.readonly){
    box-shadow: 0 0 0 0.1rem var(--accent-color) inset;
}
.placeholder{
    position: absolute;
    margin: 0.7rem 1rem;
    opacity: .7;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5;
    pointer-events: none;
    user-select: none;
}
:host([disabled]) .textarea{
    cursor: not-allowed;
    opacity: 0.6;
}
@media (any-hover: hover){
    ::-webkit-scrollbar{
        width: 0.5rem;
        height: 0.5rem;
    }
    
    ::-webkit-scrollbar-thumb{
        background: rgba(var(--text-color), 0.3);
        border-radius: 1rem;
        &:hover{
            background: rgba(var(--text-color), 0.5);
        }
    }
}
</style>
<label class="textarea" part="textarea">
    <span class="placeholder"></span>
    <textarea rows="1"></textarea>
</label>
`;
customElements.define('sm-textarea',
    class extends HTMLElement {
        constructor() {
            super()
            this.attachShadow({
                mode: 'open'
            }).append(smTextarea.content.cloneNode(true))

            this.textarea = this.shadowRoot.querySelector('textarea')
            this.textareaBox = this.shadowRoot.querySelector('.textarea')
            this.placeholder = this.shadowRoot.querySelector('.placeholder')
            this.reflectedAttributes = ['disabled', 'required', 'readonly', 'rows', 'minlength', 'maxlength']
        
            this.reset = this.reset.bind(this)
            this.focusIn = this.focusIn.bind(this)
            this.fireEvent = this.fireEvent.bind(this)
            this.checkInput = this.checkInput.bind(this)
        }
        static get observedAttributes() {
            return ['disabled', 'value', 'placeholder', 'required', 'readonly', 'rows', 'minlength', 'maxlength']
        }
        get value() {
            return this.textarea.value
        }
        set value(val) {
            this.setAttribute('value', val)
            this.fireEvent()
        }
        get disabled() {
            return this.hasAttribute('disabled')
        }
        set disabled(val) {
            if (val) {
                this.setAttribute('disabled', '')   
            } else {
                this.removeAttribute('disabled')   
            }
        }
        get isValid() {
            return this.textarea.checkValidity()
        }
        reset(){
            this.setAttribute('value', '')
        }
        focusIn(){
            this.textarea.focus()
        }
        fireEvent(){
            let event = new Event('input', {
                bubbles: true,
                cancelable: true,
                composed: true
            });
            this.dispatchEvent(event);
        }
        checkInput(){
            if (!this.hasAttribute('placeholder') || this.getAttribute('placeholder') === '')
                return;
            if (this.textarea.value !== '') {
                this.placeholder.classList.add('hide')
            } else {
                this.placeholder.classList.remove('hide')
            }
        }
        connectedCallback() {
            this.textarea.addEventListener('input', e => {
                this.textareaBox.dataset.value = this.textarea.value
                this.checkInput()
            })
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (this.reflectedAttributes.includes(name)) {
                if (this.hasAttribute(name)) {
                    this.textarea.setAttribute(name, this.getAttribute(name) ? this.getAttribute(name) : '')
                }
                else {
                    this.textContent.removeAttribute(name)
                }
            }
            else if (name === 'placeholder') {
                this.placeholder.textContent = this.getAttribute('placeholder')
            }
            else if (name === 'value') {
                this.textarea.value = newValue;
                this.textareaBox.dataset.value = newValue
                this.checkInput()
            }
        }
    })
    const smNotifications = document.createElement('template')
smNotifications.innerHTML = `
<style>
    *{
        padding: 0;
        margin: 0;
        -webkit-box-sizing: border-box;
                box-sizing: border-box;
    } 
    :host{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        --accent-color: #4d2588;
        --text-color: 17, 17, 17;
        --background-color: 255, 255, 255;
        --danger-color: red;
        --icon-height: 1.5rem;
        --icon-width: 1.5rem;
    }
    .hide{
        opacity: 0 !important;
        pointer-events: none !important;
    }
    .notification-panel{
        display: grid;
        width: 100%;
        gap: 0.5rem;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 100;
        max-height: 100%;
        padding: 1rem;
        overflow: hidden auto;
        -ms-scroll-chaining: none;
            overscroll-behavior: contain;
    }
    .notification-panel:empty{
        display:none;
    }
    .notification{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        position: relative;
        border-radius: 0.3rem;
        background: rgba(var(--background-color), 1);
        overflow: hidden;
        overflow-wrap: break-word;
        word-wrap: break-word;
        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;
        -ms-hyphens: auto;
        -webkit-hyphens: auto;
        hyphens: auto;
        max-width: 100%;
        padding: 1rem;
        align-items: center;
    }
    .icon-container:not(:empty){
        margin-right: 0.5rem;
        height: var(--icon-height);
        width: var(--icon-width);
    }
    h4:first-letter,
    p:first-letter{
        text-transform: uppercase;
    }
    h4{
        font-weight: 400;
    }
    p{
        line-height: 1.6;
        -webkit-box-flex: 1;
            -ms-flex: 1;
                flex: 1;
        color: rgba(var(--text-color), 0.9);
        overflow-wrap: break-word;
        overflow-wrap: break-word;
        word-wrap: break-word;
        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;
        -ms-hyphens: auto;
        -webkit-hyphens: auto;
        hyphens: auto;
        max-width: 100%;
    }
    .notification:last-of-type{
        margin-bottom: 0;
    }
    .icon {
        height: 100%;
        width: 100%;
        fill: rgba(var(--text-color), 0.7);
    }
    .close{
        height: 2rem;
        width: 2rem;
        border: none;
        cursor: pointer;
        margin-left: 1rem;
        border-radius: 50%;
        padding: 0.3rem;
        transition: background-color 0.3s, transform 0.3s;
        background-color: transparent;
    }
    .close:active{
        transform: scale(0.9);
    }
    @media screen and (min-width: 640px){
        .notification-panel{
            max-width: 28rem;
            width: max-content;
        }
        .notification{
            width: auto;
            border: solid 1px rgba(var(--text-color), 0.2);
        }
    }
    @media (any-hover: hover){
        ::-webkit-scrollbar{
            width: 0.5rem;
        }
        
        ::-webkit-scrollbar-thumb{
            background: rgba(var(--text-color), 0.3);
            border-radius: 1rem;
            &:hover{
                background: rgba(var(--text-color), 0.5);
            }
        }
        .close:hover{
            background-color: rgba(var(--text-color), 0.1);
        }
    }
</style>
<div class="notification-panel"></div>
`

customElements.define('sm-notifications', class extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({
            mode: 'open'
        }).append(smNotifications.content.cloneNode(true))

        this.notificationPanel = this.shadowRoot.querySelector('.notification-panel')
        this.animationOptions = {
            duration: 300,
            fill: "forwards",
            easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }

        this.push = this.push.bind(this)
        this.createNotification = this.createNotification.bind(this)
        this.removeNotification = this.removeNotification.bind(this)
        this.clearAll = this.clearAll.bind(this)

    }

    randString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    }

    createNotification(message, options) {
        const { pinned = false, icon = '' } = options
        const notification = document.createElement('div')
        notification.id = this.randString(8)
        notification.classList.add('notification')
        let composition = ``
        composition += `
            <div class="icon-container">${icon}</div>
            <p>${message}</p>
            `
        if (pinned) {
            notification.classList.add('pinned')
            composition += `
                <button class="close">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg>
                </button>
            `
        }
        notification.innerHTML = composition
        return notification
    }

    push(message, options = {}) {
        const notification = this.createNotification(message, options)
        this.notificationPanel.append(notification)
        notification.animate([
            {
                transform: `translateY(1rem)`,
                opacity: '0'
            },
            {
                transform: `none`,
                opacity: '1'
            },
        ], this.animationOptions)
        return notification.id
    }

    removeNotification(notification) {
        notification.animate([
            {
                transform: `none`,
                opacity: '1'
            },
            {
                transform: `translateY(0.5rem)`,
                opacity: '0'
            }
        ], this.animationOptions).onfinish = () => {
            notification.remove()
        }
    }

    clearAll() {
        Array.from(this.notificationPanel.children).forEach(child => {
            this.removeNotification(child)
        })
    }

    connectedCallback() {
        this.notificationPanel.addEventListener('click', e => {
            if (e.target.closest('.close')) (
                this.removeNotification(e.target.closest('.notification'))
            )
        })

        const observer = new MutationObserver(mutationList => {
            mutationList.forEach(mutation => {
                if (mutation.type === 'childList') {
                    if (mutation.addedNodes.length && !mutation.addedNodes[0].classList.contains('pinned')) {
                        setTimeout(() => {
                            this.removeNotification(mutation.addedNodes[0])
                        }, 5000);
                    }
                }
            })
        })
        observer.observe(this.notificationPanel, {
            childList: true,
        })
    }
})