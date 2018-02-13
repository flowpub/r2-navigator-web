import { IPropertyConverter, JsonValue } from 'ta-json';

export class JsonStringConverter implements IPropertyConverter {
  public serialize(property: string): JsonValue {
    return property;
  }

  public deserialize(value: JsonValue): string {
    return <string>value;
  }

  public collapseArrayWithSingleItem(): boolean {
    return true;
  }
}
