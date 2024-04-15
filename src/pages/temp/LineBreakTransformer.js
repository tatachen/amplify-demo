class LineBreakTransformer {
    constructor() {
        this.chunks = '';
    }

    transform(chunks, controller) {
        this.chunks = chunks;

        const lines = this.chunks.split('\r\n');
        this.chunks = lines.pop();
        lines.forEach((line) => controller.enqueue(line));
    }

    flush(controller) {
        controller.enqueue(this.chunks)
    }
}

export default LineBreakTransformer;