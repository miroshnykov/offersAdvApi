import requestClient from "../../utils/requestClient";
import buildMutation from "./update/buildMutation";
import camelcase from "camelcase";

export class AbstractHistory {

    constructor() {
    }

    get entityName() {
        return ''
    }

    customFieldName(oldData: any, newData: any) {
        return {}
    }

    get excludedFields() {
        return ['id']
    }

    findChanges = (oldData: any, newData: any) => {
        let changed = new Array<any>();
        Object.keys(newData)
            .filter(
                field => !Array.isArray(oldData[field]) && newData[field] !== oldData[field]
                    && this.excludedFields.indexOf(field) < 0
                    && !/^\s*$/.test(newData[field])
                    && !(Object.keys(oldData).length === 0 && newData[field] === null)
            )
            .forEach((field: any): boolean => changed[field] = true)
        Object.keys(oldData)
            .filter(
                field => !Array.isArray(newData[field]) && newData[field] !== oldData[field]
                    && this.excludedFields.indexOf(field) < 0
            )
            .forEach((field: any): boolean => changed[field] = true)
        return Object.keys(changed)
    };

    async log(oldData: any, newData: any, action: String, id: String, sessionUser: String) {
        let changed = this.findChanges(oldData, newData)
        if (!changed.length) {
            return
        }
        let preparedData = changed.map((field) => {
            return Object.assign(
                {
                    field: `${camelcase(this.entityName)}: ${field}`,
                    oldValue: oldData[field],
                    newValue: newData[field]
                }, this.customFieldName(oldData, newData))
        });
        await requestClient('setHistory')
            .post('', {
                query: buildMutation(),
                variables: {
                    id: id,
                    entity: this.entityName,
                    user: sessionUser,
                    action: action,
                    logs: JSON.stringify(preparedData),
                },
            });

    }
}
