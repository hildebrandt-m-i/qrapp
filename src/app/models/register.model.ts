export class Register {
    public format: string;
    public text: string;
    public type: string;
    public icon: string;
    public created: Date;

    constructor( format: string, text: string ) {
        this.format = format;
        this.text = text;
        this.created = new Date();

        this.determinateType();
    }

    private determinateType() {
        const startText = this.text.substr(0, 4);

        switch ( startText ) {
            case 'http':
                this.type = 'http';
                this.icon = 'earth-outline';
                break;
            case 'geo:':
                this.type = 'geo';
                this.icon = 'location-sharp';
                break;
            default:
                this.type = 'Unknown';
                this.icon = 'help-circle-outline';
                break;
        }
    }
}
