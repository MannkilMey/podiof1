import UIKit
import Capacitor

extension CAPBridgeViewController {
    open override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.webView?.allowsBackForwardNavigationGestures = true
    }
}