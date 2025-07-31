import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DynamicStringValidationPipe implements PipeTransform {
    constructor(private fieldName: string, private validators: Array<any>) { }

    async transform(value: any) {

        if (!(this.fieldName in value)) {
            throw new BadRequestException(`${this.fieldName} must be a string`);
        }

        const extraFields = Object.keys(value).filter(key => key !== this.fieldName);
        if (extraFields.length > 0) {
            throw new BadRequestException(`property ${extraFields.join(', ')} should not exist`);
        }

        class DynamicDto { }

        Object.defineProperty(DynamicDto.prototype, this.fieldName, {
            value: value[this.fieldName],
            writable: true,
            enumerable: true,
            configurable: true,
        });

        Reflect.decorate(this.validators, DynamicDto.prototype, this.fieldName);
        const object = plainToClass(DynamicDto, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            const errorMessages = errors
                .map(err => Object.values(err.constraints))
                .reduce((acc, val) => acc.concat(val), []);

            throw new BadRequestException(errorMessages.join(', '));
        }

        return value;
    }
}
