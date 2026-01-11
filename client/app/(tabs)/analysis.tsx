import React, { useEffect } from 'react';
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
import { useAnalysisStore } from '@/stores';
import type { RiskItem, KeyTerm } from '@/services';

/**
 * Analysis Tab Screen
 * Displays contract analysis loading state, progress, and results
 * Supports both direct image analysis and queue-based contract analysis
 */
export default function AnalysisScreen() {
  const {
    currentImage,
    analysisResult,
    queueResult,
    analysisStatus,
    isLoading,
    isPolling,
    progress,
    error,
    mode,
    viewSource,
    clearAnalysis,
    stopPolling,
  } = useAnalysisStore();

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Helper to get the combined result (either direct or queue-based)
  const getDisplayResult = () => {
    if (mode === 'direct' && analysisResult) {
      return {
        summary: analysisResult.summary,
        riskLevel: analysisResult.riskLevel,
        risks: analysisResult.risks,
        keyTerms: analysisResult.keyTerms,
        recommendations: analysisResult.recommendations,
        contractInfo: analysisResult.contractInfo,
        analyzedAt: analysisResult.analyzedAt,
      };
    }
    if (mode === 'queue' && queueResult) {
      return {
        summary: queueResult.overviewData.summary,
        riskLevel: queueResult.overviewData.riskLevel,
        risks: queueResult.risks,
        keyTerms: queueResult.overviewData.keyTerms,
        recommendations: queueResult.suggestionsData.recommendations,
        contractInfo: queueResult.overviewData.contractInfo,
        analyzedAt: queueResult.overviewData.analyzedAt,
      };
    }
    return null;
  };

  const displayResult = getDisplayResult();

  // Loading state with progress
  if (isLoading || isPolling) {
    const statusText =
      analysisStatus?.status === 'processing' ? 'Processing Contract...' : 'Analyzing Contract...';

    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          {currentImage && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: currentImage }} style={styles.previewImage} />
            </View>
          )}
          <ActivityIndicator size="large" color="#667eea" style={styles.loader} />
          <Text style={styles.loadingText}>{statusText}</Text>
          <Text style={styles.loadingSubtext}>AI is analyzing contract content</Text>

          {/* Progress bar for queue-based analysis */}
          {mode === 'queue' && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{progress}%</Text>
            </View>
          )}

          {/* Status info for queue-based analysis */}
          {analysisStatus && <Text style={styles.statusText}>Status: {analysisStatus.status}</Text>}
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
  if (displayResult) {
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
          {/* View Source Indicator */}
          {viewSource === 'history' && (
            <View style={styles.sourceBadgeContainer}>
              <View style={styles.sourceBadge}>
                <Text style={styles.sourceBadgeIcon}>📜</Text>
                <Text style={styles.sourceBadgeText}>Historical Analysis</Text>
              </View>
            </View>
          )}

          {/* Image Preview */}
          {currentImage && (
            <View style={styles.resultImagePreview}>
              <Image source={{ uri: currentImage }} style={styles.resultImage} />
            </View>
          )}

          {/* Contract Info (if available) */}
          {displayResult.contractInfo && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📄 Contract Information</Text>
              {displayResult.contractInfo.type && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Type:</Text>
                  <Text style={styles.infoValue}>{displayResult.contractInfo.type}</Text>
                </View>
              )}
              {displayResult.contractInfo.parties &&
                displayResult.contractInfo.parties.length > 0 && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Parties:</Text>
                    <Text style={styles.infoValue}>
                      {displayResult.contractInfo.parties.join(', ')}
                    </Text>
                  </View>
                )}
              {displayResult.contractInfo.effectiveDate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Effective Date:</Text>
                  <Text style={styles.infoValue}>{displayResult.contractInfo.effectiveDate}</Text>
                </View>
              )}
              {displayResult.contractInfo.expirationDate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Expiration Date:</Text>
                  <Text style={styles.infoValue}>{displayResult.contractInfo.expirationDate}</Text>
                </View>
              )}
              {displayResult.contractInfo.totalValue && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Total Value:</Text>
                  <Text style={styles.infoValue}>{displayResult.contractInfo.totalValue}</Text>
                </View>
              )}
            </View>
          )}

          {/* Overall Risk Level */}
          <View style={styles.riskLevelCard}>
            <LinearGradient
              colors={[
                getRiskLevelColor(displayResult.riskLevel) + '20',
                getRiskLevelColor(displayResult.riskLevel) + '10',
              ]}
              style={styles.riskLevelGradient}
            >
              <Text style={styles.riskLevelLabel}>Overall Risk Level</Text>
              <View
                style={[
                  styles.riskBadge,
                  { backgroundColor: getRiskLevelColor(displayResult.riskLevel) },
                ]}
              >
                <Text style={styles.riskBadgeText}>
                  {getRiskLevelText(displayResult.riskLevel)}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Summary */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📋 Summary</Text>
            <Text style={styles.summaryText}>{displayResult.summary}</Text>
          </View>

          {/* Risk Items */}
          {displayResult.risks.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                ⚠️ Risk Identification ({displayResult.risks.length})
              </Text>
              {displayResult.risks.map((risk: RiskItem, index: number) => (
                <View key={risk.id || index} style={styles.riskItem}>
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
                  {risk.category && (
                    <Text style={styles.riskCategory}>Category: {risk.category}</Text>
                  )}
                  {risk.suggestion && (
                    <Text style={styles.riskSuggestion}>💡 {risk.suggestion}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Key Terms */}
          {displayResult.keyTerms.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📝 Key Terms ({displayResult.keyTerms.length})</Text>
              {displayResult.keyTerms.map((term: KeyTerm, index: number) => (
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
          {displayResult.recommendations.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>💡 Recommendations</Text>
              {displayResult.recommendations.map((recommendation: string, index: number) => (
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
              <Text style={styles.actionButtonText}>
                {viewSource === 'history' ? 'Re-analyze' : 'Analyze Again'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Timestamp */}
          <Text style={styles.timestamp}>
            {viewSource === 'history' ? 'Analyzed' : 'Completed'} at:{' '}
            {new Date(displayResult.analyzedAt).toLocaleString('en-US')}
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
    marginBottom: 16,
  },
  // Progress styles
  progressContainer: {
    width: '80%',
    alignItems: 'center',
    marginTop: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 4,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  statusText: {
    marginTop: 12,
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
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
  // Contract info styles
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    width: 100,
  },
  infoValue: {
    fontSize: 13,
    color: '#333',
    flex: 1,
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
  riskCategory: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  riskSuggestion: {
    fontSize: 12,
    color: '#667eea',
    marginTop: 6,
    fontStyle: 'italic',
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
  // Source badge styles
  sourceBadgeContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  sourceBadgeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  sourceBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#667eea',
  },
});
