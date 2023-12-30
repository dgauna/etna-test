import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
export const validationMsg = {
    tarea: [
        { type: 'required', message: 'El nombre de la tarea es obligatorio' },
        { type: 'maxlength', message: 'El nombre de la tarea debe tener un maximo de 50 caracteres' },
        { type: 'soloLetras', message: 'El nombre de la tarea debe contener solamente letras' },
        { type: 'espacios', message: 'El nombre de la tarea no puede contener espacios en blanco al principio y/o final' }
    ], descripcion: [
        { type: 'required', message: 'La descripción de la tarea es obligatoria' },
        { type: 'maxlength', message: 'La descripción debe tener un maximo de 500 caracteres' },
        { type: 'espacios', message: 'La descripción no puede contener espacios en blanco al principio y/o final'}
    ], categoria: [
        { type: 'required', message: 'La categoría es obligatoria'}
    ], prioridad: [
        { type: 'required', message: 'La prioridad es obligatoria' },
        { type: 'prioridad', message: 'La prioridad debe establecerse con un número del 1 al 5' },
    ],
    email: [
        { type: 'required', message: 'Ingrese su email para iniciar sesión' },
        { type: 'email', message: 'Ingrese un formato de email valido' }
    ],
    nombre: [
        { type: 'required', message: 'El nombre es obligatorio' },
        { type: 'maxlength', message: 'El nombre debe tener un maximo de 50 caracteres' },
        { type: 'soloLetras', message: 'El nombre debe contener solamente letras' },
        { type: 'espacios', message: 'El nombre no puede contener espacios en blanco al principio y/o final' }
    ],
    apellido: [
        { type: 'required', message: 'El apellido es obligatorio' },
        { type: 'maxlength', message: 'El apellido debe tener un maximo de 50 caracteres' },
        { type: 'soloLetras', message: 'El apellido debe contener solamente letras' },
        { type: 'espacios', message: 'El apellido no puede contener espacios en blanco al principio y/o final' }
    ],
    password: [
        { type: 'required', message: 'La contraseña es obligatoria' },
        { type: 'minlength', message: 'La contraseña debe tener un minimo de 8 caracteres' },
        { type: 'pattern', message: 'La contraseña debe tener al menos un caracter alfanumerico, un digito numerico y una letra mayuscula' },
        { type: 'coindencia', message: 'Las contraseñas no coinciden'}
    ],
    confirmPassword: [
        { type: 'required', message: 'La contraseña es obligatoria' },
        { type: 'minlength', message: 'La contraseña debe tener un minimo de 8 caracteres' },
        { type: 'pattern', message: 'La contraseña debe tener al menos un caracter alfanumerico, un digito numerico y una letra mayuscula' },
        { type: 'coindencia', message: 'Las contraseñas no coinciden'}
    ]

}

export function espacios(control:AbstractControl): {[key: string]: any } | null {
    const valor = control.value
    if(/^\S(?:.*\S)?$/.test(valor)) {
        return null
    } else {
        return { espacios: { value: valor } }
    }
}

export function soloLetras(control: AbstractControl): {[key: string]: any} | null {
    const valor = control.value;
    if(/^[a-zA-Z\u00C0-\u017F\s]+$/.test(valor)) {
        return null;
    } else {
        return { soloLetras: { value: valor } }
    }
}

export function prioridad(control: AbstractControl): {[key: string]: any} | null {
    const valor = control.value
    if(/^[1-5]$/.test(valor)) {
        return null
    } else {
        return { prioridad: { value: valor} }
    }
}

export const passCoincidence: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    const password = control.get('password')
    const confirm = control.get('confirmPassword')

    if (password && confirm && password.value !== confirm.value) {
        confirm.setErrors({ isMatching: true })
        return { isMatching: false }
    } else {
        return null
    }
}
