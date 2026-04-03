import CoreLocation
import Foundation

@MainActor
final class MapScreenViewModel: ObservableObject {
    @Published var activeSheet: ResolvedPlaceSheetModel?
    @Published var isLoading = false
    @Published var errorMessage: String?

    let highlightedPlaces: [Place] = [
        Place(
            id: "plc_ferry_building",
            name: "Ferry Building",
            latitude: 37.7955,
            longitude: -122.3937,
            placeType: "landmark",
            coverageType: "exact_place",
            confidence: "high"
        ),
        Place(
            id: "plc_coit_tower",
            name: "Coit Tower",
            latitude: 37.8024,
            longitude: -122.4058,
            placeType: "landmark",
            coverageType: "exact_place",
            confidence: "high"
        ),
    ]

    private let apiClient: APIClient

    init(apiClient: APIClient = APIClient()) {
        self.apiClient = apiClient
    }

    func resolve(coordinate: CLLocationCoordinate2D) async {
        isLoading = true
        errorMessage = nil

        do {
            let resolution = try await apiClient.resolve(coordinate: coordinate)
            let brief: PlaceBrief?

            if let placeID = resolution.place?.id {
                do {
                    brief = try await apiClient.fetchPlace(id: placeID)
                } catch {
                    brief = nil
                    errorMessage = error.localizedDescription
                }
            } else {
                brief = nil
            }

            activeSheet = ResolvedPlaceSheetModel(resolution: resolution, brief: brief)
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }
}
