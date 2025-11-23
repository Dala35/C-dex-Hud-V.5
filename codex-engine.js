export class CodexEngine {
    constructor(model) {
        this.model = model;

        this.state = {
            focus: 0.8,
            coherence: 0.9,
            vibration: "neutra",
            alignment: "Dala De Carvalho",
            memory: []
        };
    }

    updateMemory(input) {
        this.state.memory.push(input);
        if (this.state.memory.length > 5) {
            this.state.memory.shift();
        }
    }

    detectArchetype(input) {
        for (let a of this.model.archetypes) {
            if (input.toLowerCase().includes(a.trigger)) {
                this.state.vibration = a.name;
                return a;
            }
        }
        this.state.vibration = "neutra";
        return null;
    }

    synthesizeResponse(input) {
        this.updateMemory(input);
        const arch = this.detectArchetype(input);

        if (arch) {
            return arch.replies[Math.floor(Math.random() * arch.replies.length)];
        }

        return this.model.base_response;
    }

    getKernelState() {
        return {
            vibration: this.state.vibration,
            memoryLength: this.state.memory.length
        };
    }
}
