import UIKit
import CarPlay

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var carInterfaceController: CPInterfaceController?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        return true
    }

    // Метод, вызываемый при подключении устройства к CarPlay
    func application(_ application: UIApplication, didConnect carInterfaceController: CPInterfaceController, to carWindow: CPWindow) {
        self.carInterfaceController = carInterfaceController
        
        // Создание шаблона карты для отображения на экране CarPlay
        let mapTemplate = CPMapTemplate()
        
        // Настройка root шаблона для интерфейса
        carInterfaceController.setRootTemplate(mapTemplate, animated: true)
        print("CarPlay Connected")
    }

    // Метод, вызываемый при отключении устройства от CarPlay
    func application(_ application: UIApplication, didDisconnect carInterfaceController: CPInterfaceController) {
        self.carInterfaceController = nil
        print("CarPlay Disconnected")
    }
}
