import MapKit
import SwiftUI

struct MapScreen: View {
    @StateObject private var viewModel = MapScreenViewModel()
    @State private var cameraPosition: MapCameraPosition = .region(
        MKCoordinateRegion(
            center: CLLocationCoordinate2D(latitude: 37.7749, longitude: -122.4194),
            span: MKCoordinateSpan(latitudeDelta: 0.12, longitudeDelta: 0.12)
        )
    )

    var body: some View {
        MapReader { proxy in
            Map(position: $cameraPosition) {
                UserAnnotation()

                ForEach(viewModel.highlightedPlaces) { place in
                    Annotation(
                        place.name,
                        coordinate: CLLocationCoordinate2D(
                            latitude: place.latitude,
                            longitude: place.longitude
                        )
                    ) {
                        Button {
                            cameraPosition = .region(
                                MKCoordinateRegion(
                                    center: CLLocationCoordinate2D(
                                        latitude: place.latitude,
                                        longitude: place.longitude
                                    ),
                                    span: MKCoordinateSpan(latitudeDelta: 0.04, longitudeDelta: 0.04)
                                )
                            )
                            Task {
                                await viewModel.resolve(
                                    coordinate: CLLocationCoordinate2D(
                                        latitude: place.latitude,
                                        longitude: place.longitude
                                    )
                                )
                            }
                        } label: {
                            VStack(spacing: 4) {
                                Circle()
                                    .fill(.white)
                                    .frame(width: 18, height: 18)
                                    .overlay {
                                        Circle()
                                            .stroke(Color.black.opacity(0.7), lineWidth: 4)
                                    }
                                    .shadow(radius: 6, y: 2)

                                Text(place.name)
                                    .font(.caption2.weight(.medium))
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(.ultraThinMaterial, in: Capsule())
                            }
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .mapStyle(.standard(elevation: .realistic))
            .overlay {
                GeometryReader { _ in
                    Color.clear
                        .contentShape(Rectangle())
                        .gesture(
                            LongPressGesture(minimumDuration: 0.45)
                                .sequenced(
                                    before: DragGesture(minimumDistance: 0, coordinateSpace: .local)
                                )
                                .onEnded { value in
                                    handleLongPress(value, proxy: proxy)
                                }
                        )
                }
            }
            .ignoresSafeArea()
            .overlay(alignment: .top) {
                VStack(spacing: 10) {
                    Text("Placewise")
                        .font(.headline)
                        .padding(10)
                        .background(.ultraThinMaterial, in: Capsule())

                    Text("Long-press anywhere or tap a highlighted place")
                        .font(.caption)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(.ultraThinMaterial, in: Capsule())
                }
                .padding(.top, 12)
            }
            .overlay(alignment: .bottom) {
                if viewModel.isLoading {
                    ProgressView("Resolving place...")
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(.ultraThinMaterial, in: Capsule())
                        .padding(.bottom, 24)
                } else if let errorMessage = viewModel.errorMessage {
                    Text(errorMessage)
                        .font(.footnote)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(.ultraThinMaterial, in: Capsule())
                        .padding(.horizontal, 20)
                        .padding(.bottom, 24)
                }
            }
            .sheet(item: $viewModel.activeSheet) { model in
                PlaceResolutionSheet(model: model)
            }
        }
    }

    private func handleLongPress(
        _ value: SequenceGesture<LongPressGesture, DragGesture>.Value,
        proxy: MapProxy
    ) {
        guard case let .second(true, drag?) = value,
              let coordinate = proxy.convert(drag.location, from: .local)
        else {
            return
        }

        Task {
            await viewModel.resolve(coordinate: coordinate)
        }
    }
}
