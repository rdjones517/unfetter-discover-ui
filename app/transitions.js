export default function() {
    this.transition(
        this.fromRoute("report-dashboard"),
        this.toRoute("report-kill-chain-phase"),
        this.use("toLeft"),
        this.reverse("toRight")
    );
    this.transition(
        this.inHelper("liquid-modal"),
        this.use("crossFade")
    );
}