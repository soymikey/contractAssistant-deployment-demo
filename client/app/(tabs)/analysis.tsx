import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAnalysisStore } from '@/src/stores/analysisStore';

/**
 * Analysis Tab Screen
 * Displays contract analysis loading state and results
 */
export default function AnalysisScreen() {
  const { currentImage, analysisResult, isLoading, error, clearAnalysis } = useAnalysisStore();

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          {currentImage && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: currentImage }} style={styles.previewImage} />
            </View>
          )}
          <ActivityIndicator size="large" color="#667eea" style={styles.loader} />
          <Text style={styles.loadingText}>Analyzing Contract...</Text>
          <Text style={styles.loadingSubtext}>AI is analyzing contract content</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Analysis Failed</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={clearAnalysis}>
            <Text style={styles.retryButtonText}>Back to Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Results state
  if (analysisResult) {
    const getRiskLevelColor = (level: string) => {
      switch (level) {
        case 'high':
          return '#ef4444';
        case 'medium':
          return '#f59e0b';
        case 'low':
          return '#10b981';
        default:
          return '#6b7280';
      }
    };

    const getRiskLevelText = (level: string) => {
      switch (level) {
        case 'high':
          return 'High Risk';
        case 'medium':
          return 'Medium Risk';
        case 'low':
          return 'Low Risk';
        default:
          return level;
      }
    };

    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case 'high':
          return '#ef4444';
        case 'medium':
          return '#f59e0b';
        case 'low':
          return '#10b981';
        default:
          return '#6b7280';
      }
    };

    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Image Preview */}
          {currentImage && (
            <View style={styles.resultImagePreview}>
              <Image source={{ uri: currentImage }} style={styles.resultImage} />
            </View>
          )}

          {/* Overall Risk Level */}
          <View style={styles.riskLevelCard}>
            <LinearGradient
              colors={[
                getRiskLevelColor(analysisResult.riskLevel) + '20',
                getRiskLevelColor(analysisResult.riskLevel) + '10',
              ]}
              style={styles.riskLevelGradient}
            >
              <Text style={styles.riskLevelLabel}>Overall Risk Level</Text>
              <View
                style={[
                  styles.riskBadge,
                  { backgroundColor: getRiskLevelColor(analysisResult.riskLevel) },
                ]}
              >
                <Text style={styles.riskBadgeText}>
                  {getRiskLevelText(analysisResult.riskLevel)}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Summary */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📋 Summary</Text>
            <Text style={styles.summaryText}>{analysisResult.summary}</Text>
          </View>

          {/* Risk Items */}
          {analysisResult.risks.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                ⚠️ Risk Identification ({analysisResult.risks.length})
              </Text>
              {analysisResult.risks.map((risk, index) => (
                <View key={index} style={styles.riskItem}>
                  <View style={styles.riskHeader}>
                    <Text style={styles.riskTitle}>{risk.title}</Text>
                    <View
                      style={[
                        styles.severityBadge,
                        { backgroundColor: getSeverityColor(risk.severity) },
                      ]}
                    >
                      <Text style={styles.severityBadgeText}>{risk.severity}</Text>
                    </View>
                  </View>
                  <Text style={styles.riskDescription}>{risk.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Key Terms */}
          {analysisResult.keyTerms.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📝 Key Terms ({analysisResult.keyTerms.length})</Text>
              {analysisResult.keyTerms.map((term, index) => (
                <View key={index} style={styles.termItem}>
                  <View style={styles.termHeader}>
                    <Text style={styles.termTitle}>{term.title}</Text>
                    <Text style={styles.termImportance}>{term.importance}</Text>
                  </View>
                  <Text style={styles.termContent}>{term.content}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Recommendations */}
          {analysisResult.recommendations.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>💡 Recommendations</Text>
              {analysisResult.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={styles.recommendationBullet}>•</Text>
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={clearAnalysis}>
              <Text style={styles.actionButtonText}>Analyze Again</Text>
            </TouchableOpacity>
          </View>

          {/* Timestamp */}
          <Text style={styles.timestamp}>
            Analyzed at: {new Date(analysisResult.analyzedAt).toLocaleString('en-US')}
          </Text>
        </View>
      </ScrollView>
    );
  }

  // Empty state
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>📊</Text>
          <Text style={styles.placeholderText}>No Analysis Yet</Text>
          <Text style={styles.placeholderSubtext}>Take a photo or upload a contract from home</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  // Loading styles
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  loader: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
  },
  // Error styles
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Result styles
  resultImagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  riskLevelCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  riskLevelGradient: {
    padding: 20,
    alignItems: 'center',
  },
  riskLevelLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  riskBadge: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  riskBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  riskItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  riskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  severityBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  severityBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  riskDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  termItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  termHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  termTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  termImportance: {
    fontSize: 11,
    color: '#667eea',
    fontWeight: '600',
  },
  termContent: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  recommendationBullet: {
    fontSize: 14,
    color: '#667eea',
    marginRight: 8,
    fontWeight: '700',
  },
  recommendationText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    flex: 1,
  },
  actionButtons: {
    marginVertical: 16,
  },
  actionButton: {
    backgroundColor: '#667eea',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  // Empty state
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999',
  },
});
