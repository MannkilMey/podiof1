import Capacitor

extension CAPBridgeViewController {
    override open func viewDidLoad() {
        super.viewDidLoad()
        webView?.allowsBackForwardNavigationGestures = true
    }
}
