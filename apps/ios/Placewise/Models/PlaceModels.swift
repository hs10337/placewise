import Foundation

struct Place: Codable, Identifiable {
    let id: String
    let name: String
    let latitude: Double
    let longitude: Double
    let placeType: String
    let coverageType: String
    let confidence: String
}

struct PlaceBrief: Codable {
    let id: String
    let name: String
    let hook: String
    let summary: String
    let whyItMatters: String
    let facts: [String]
    let lenses: [Lens]
    let sources: [Source]
    let confidence: String
    let coverageType: String
}

struct Source: Codable {
    let labelType: String
    let title: String
    let url: String
}

struct Lens: Codable {
    let type: String
    let body: String
}

struct ResolveSelection: Codable {
    let lat: Double
    let lng: Double
}

struct ResolveResponse: Codable, Identifiable {
    let selection: ResolveSelection
    let mode: String
    let confidence: String
    let distanceMeters: Double?
    let place: Place?

    var id: String {
        place?.id ?? "\(selection.lat),\(selection.lng)"
    }
}

struct ResolvedPlaceSheetModel: Identifiable {
    let resolution: ResolveResponse
    let brief: PlaceBrief?

    var id: String {
        resolution.id
    }
}
